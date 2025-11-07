import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
// Import the scanner state for robust stopping
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

const MobileScanner = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);
  const SCAN_COOLDOWN = 3000; // 3 seconds cooldown between scans

  // scannerRef will hold the Html5Qrcode instance
  const scannerRef = useRef(null);

  // This constant must match the ID in the JSX
  const QR_READER_ID = "qr-reader";

  // Effect 1: Get available cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        console.log("Available cameras:", devices);
        if (devices && devices.length) {
          setCameras(devices);
          // Try to select the back camera by default
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back")
          );
          setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.error("Error getting cameras:", err);
      });
  }, []); // Runs once on mount

  // Effect 2: Socket connection setup
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    console.log("🔌 Auto-connecting to:", SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup: disconnect socket on component unmount
    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []); // Runs once on mount

  // Effect 3: Scanner cleanup on component unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => console.log("Scanner stopped on unmount"))
          .catch((err) =>
            console.error("Error stopping scanner on unmount:", err)
          );
      }
    };
  }, []); // Runs once on mount

  const startScanner = async () => {
    if (!selectedCamera) {
      alert("No camera selected!");
      return;
    }

    // *** KEY FIX: Create the instance here ***
    // This ensures the <div id="qr-reader"> exists
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(QR_READER_ID);
    }

    // Stop any existing scanner before starting a new one
    await stopScanner();

    try {
      await scannerRef.current.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Ignore "QR code not found" messages
        }
      );
      setScannerActive(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      alert("Failed to start scanner: " + err.message);
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        // Only stop if it's currently scanning
        if (
          scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
        ) {
          await scannerRef.current.stop();
          console.log("Scanner stopped successfully");
        }
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScannerActive(false);
  };

  const handleScan = (barcode) => {
    const now = Date.now();

    // Prevent scanning if:
    // 1. Currently confirming a scan
    // 2. Same code as last scan and within cooldown period
    if (
      isConfirming ||
      (barcode === lastScanned && now - lastScanTime < SCAN_COOLDOWN)
    ) {
      return;
    }

    if (!socket || !connected) {
      alert("Not connected to server!");
      return;
    }

    // Update scan time and last scanned barcode immediately
    setLastScanTime(now);
    setLastScanned(barcode);

    // Set confirming state and pause scanner
    setIsConfirming(true);

    // Temporarily stop the scanner
    if (scannerRef.current) {
      scannerRef.current.pause();
    }

    // Vibrate to indicate scan
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Process the scan after a delay
    setTimeout(() => {
      console.log("📊 Sending barcode:", barcode);
      socket.emit("barcode-scanned", { barcode });

      setScanHistory((prev) => [
        {
          barcode,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9),
      ]);

      setIsConfirming(false);

      // Resume the scanner
      if (scannerRef.current) {
        scannerRef.current.resume();
      }
    }, 3000); // 3 second delay
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
    stopScanner(); // Use the robust stopScanner function
    setConnected(false);
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

      {!connected && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⏳ Connecting...</h2>
          <p style={styles.helpText}>Attempting to connect to server...</p>
        </div>
      )}

      {connected && (
        <>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Camera Scanner</h2>
            <select
              style={styles.input}
              value={selectedCamera || ""}
              onChange={(e) => setSelectedCamera(e.target.value)}
              disabled={scannerActive} // Disable while scanner is running
            >
              <option value="">Select a camera</option>
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${camera.id}`}
                </option>
              ))}
            </select>
            <p style={styles.helpText}>
              {scannerActive
                ? "Camera is active. Point at barcode to scan."
                : "Select a camera and click Start to begin scanning."}
            </p>
            {!scannerActive ? (
              <button
                onClick={startScanner}
                style={{ ...styles.button, backgroundColor: "#28a745" }}
                disabled={!selectedCamera}
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
            {/* *** This ID must match the constant *** */}
            <div id={QR_READER_ID} style={styles.scannerContainer}></div>
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
  helpText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
    lineHeight: "1.5",
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
