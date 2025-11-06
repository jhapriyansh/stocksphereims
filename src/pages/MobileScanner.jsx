import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Html5QrcodeScanner } from "html5-qrcode";

const MobileScanner = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [showConfig, setShowConfig] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch(() => {});
      }
    };
  }, [socket]);

  const connectToServer = () => {
    if (!serverUrl.trim()) {
      alert("Please enter server URL");
      return;
    }

    // Clean up previous connection
    if (socket) {
      socket.disconnect();
    }

    const socketInstance = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server");
      setConnected(true);
      setShowConfig(false);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
      alert("Failed to connect. Check server URL and network.");
    });

    setSocket(socketInstance);
  };

  const initializeScanner = () => {
    if (scannerActive) {
      alert("Scanner already active!");
      return;
    }

    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch(() => {});
    }

    try {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [0, 1, 2, 3, 4, 5, 6, 7, 8], // All barcode types
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleScan(decodedText);
        },
        (error) => {
          // Silently ignore scanning errors
        }
      );

      html5QrcodeScannerRef.current = scanner;
      setScannerActive(true);
    } catch (error) {
      console.error("Scanner initialization error:", error);
      alert("Failed to start scanner. Please check camera permissions.");
    }
  };

  const stopScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current
        .clear()
        .then(() => {
          setScannerActive(false);
          console.log("Scanner stopped");
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    }
  };

  const handleScan = (barcode) => {
    if (!socket || !connected) {
      alert("Not connected to server!");
      return;
    }

    console.log("📊 Sending barcode:", barcode);
    socket.emit("barcode-scanned", { barcode });

    setLastScanned(barcode);
    setScanHistory((prev) => [
      {
        barcode,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 9),
    ]);

    // Visual feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch(() => {});
    }
    setShowConfig(true);
    setConnected(false);
    setScannerActive(false);
    setScanHistory([]);
    setLastScanned("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📱 Barcode Scanner</h1>
        <div style={styles.statusContainer}>
          <div
            style={{
              ...styles.statusDot,
              backgroundColor: connected ? "#28a745" : "#dc3545",
            }}
          ></div>
          <span style={styles.statusText}>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {showConfig && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Server Configuration</h2>
          <div style={styles.instructionsBox}>
            <h3 style={styles.instructionsTitle}>📋 Setup Instructions:</h3>
            <ol style={styles.instructionsList}>
              <li>Make sure your phone and computer are on the same WiFi</li>
              <li>
                Find your computer's IP address:
                <ul>
                  <li>
                    Mac/Linux:{" "}
                    <code style={styles.code}>ifconfig | grep "inet "</code>
                  </li>
                  <li>
                    Windows: <code style={styles.code}>ipconfig</code>
                  </li>
                </ul>
              </li>
              <li>Look for an address like 192.168.1.X or 10.0.0.X</li>
              <li>Enter it below in this format: http://192.168.1.X:5001</li>
            </ol>
          </div>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://192.168.1.100:5001"
            style={styles.input}
          />
          <button onClick={connectToServer} style={styles.button}>
            Connect to Server
          </button>
        </div>
      )}

      {connected && (
        <>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Camera Scanner</h2>
            <p style={styles.helpText}>
              {scannerActive
                ? "Camera is active. Point at barcode to scan."
                : "Click button below to start camera scanner."}
            </p>
            {!scannerActive ? (
              <button
                onClick={initializeScanner}
                style={{ ...styles.button, backgroundColor: "#28a745" }}
              >
                Start Camera Scanner
              </button>
            ) : (
              <button
                onClick={stopScanner}
                style={{ ...styles.button, backgroundColor: "#dc3545" }}
              >
                Stop Scanner
              </button>
            )}
            <div id="reader" style={styles.scannerContainer}></div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Manual Entry</h2>
            <form onSubmit={handleManualSubmit}>
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter Product ID"
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Send to Cart
              </button>
            </form>
          </div>

          {lastScanned && (
            <div style={{ ...styles.card, backgroundColor: "#d4edda" }}>
              <h3 style={styles.cardTitle}>✅ Last Scanned</h3>
              <p style={styles.lastScannedText}>{lastScanned}</p>
            </div>
          )}

          {scanHistory.length > 0 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Scan History</h2>
              <div style={styles.historyContainer}>
                {scanHistory.map((item, index) => (
                  <div key={index} style={styles.historyItem}>
                    <span style={styles.historyBarcode}>{item.barcode}</span>
                    <span style={styles.historyTime}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleDisconnect}
            style={{ ...styles.button, backgroundColor: "#dc3545" }}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  statusDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "14px",
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#333",
    marginTop: "0",
  },
  instructionsBox: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  instructionsTitle: {
    fontSize: "16px",
    marginTop: "0",
    marginBottom: "10px",
    color: "#495057",
  },
  instructionsList: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    paddingLeft: "20px",
    marginBottom: "0",
  },
  helpText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  code: {
    backgroundColor: "#e9ecef",
    padding: "2px 6px",
    borderRadius: "3px",
    fontSize: "13px",
    fontFamily: "monospace",
    color: "#495057",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  scannerContainer: {
    width: "100%",
    minHeight: "200px",
    marginTop: "15px",
  },
  lastScannedText: {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#155724",
    wordBreak: "break-all",
    margin: "0",
  },
  historyContainer: {
    maxHeight: "200px",
    overflowY: "auto",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
  historyBarcode: {
    fontWeight: "500",
    color: "#333",
  },
  historyTime: {
    fontSize: "14px",
    color: "#666",
  },
};

export default MobileScanner;
