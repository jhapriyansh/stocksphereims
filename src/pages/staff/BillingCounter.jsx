import React, { useState, useEffect, useMemo, useRef } from "react";
import { getProducts, createBill } from "../../services/api";
import InvoiceModal from "../../components/InvoiceModal";
import { io } from "socket.io-client";

const BillingCounter = () => {
  const [sku, setSku] = useState("");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [products, setProducts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [scannerConnected, setScannerConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductFromSearch, setSelectedProductFromSearch] =
    useState(null);
  const [customerName, setCustomerName] = useState("Walk-in Customer");

  const productsRef = useRef([]);

  const fetchProducts = async () => {
    try {
      console.log("📥 Fetching products...");
      const response = await getProducts();
      console.log("✅ Products fetched:", response.data);

      const availableProducts = response.data
        .filter((p) => p.quantity > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log("✅ Available products:", availableProducts);
      setProducts(availableProducts);
      productsRef.current = availableProducts; // Keep ref updated
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const addItemByBarcode = (barcode) => {
    setError("");

    console.log("🔍 Looking for product with barcode:", barcode);
    console.log(
      "📊 Available products:",
      productsRef.current.map((p) => ({ id: p._id, name: p.name }))
    );

    const item = productsRef.current.find((i) => i._id === barcode);

    if (item) {
      if (item.quantity > 0) {
        setCart((prevCart) => {
          const existingCartItem = prevCart.find((ci) => ci._id === item._id);
          const currentStock = item.quantity;
          const currentCartCount = existingCartItem
            ? existingCartItem.quantity
            : 0;

          if (currentCartCount + 1 <= currentStock) {
            if (existingCartItem) {
              return prevCart.map((ci) =>
                ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
              );
            } else {
              return [...prevCart, { ...item, quantity: 1 }];
            }
          } else {
            setError(
              `Not enough stock for ${item.name}! Available: ${currentStock}`
            );
            return prevCart;
          }
        });

        // Update products ref
        productsRef.current = productsRef.current.map((p) => {
          if (p._id === item._id) {
            return { ...p, quantity: p.quantity - 1 };
          }
          return p;
        });
        setProducts([...productsRef.current]);
      } else {
        setError(`${item.name} is out of stock!`);
      }
    } else {
      setError("Item not found with barcode: " + barcode);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product._id.toLowerCase().includes(lowerCaseSearch)
      )
      .slice(0, 10);
  }, [searchTerm, products]);

  const handleAddItem = (e, itemToAdd = null) => {
    e.preventDefault();
    setError("");
    const item = itemToAdd || products.find((i) => i._id === sku);

    if (item) {
      addItemByBarcode(item._id);
    } else if (sku) {
      setError("Item not found!");
    }

    setSku("");
    setSearchTerm("");
    setSelectedProductFromSearch(null);
  };

  const handleProductSelection = (product) => {
    setSelectedProductFromSearch(product);
    setSearchTerm(product.name);
  };

  const handleAddSelectedToCart = (e) => {
    if (selectedProductFromSearch) {
      handleAddItem(e, selectedProductFromSearch);
    } else {
      setError("Please select a product from the list.");
      e.preventDefault();
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Cart is empty.");
      return;
    }

    try {
      const billData = {
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateTotal(),
        customerName: customerName,
      };

      const response = await createBill(billData);

      const newInvoice = {
        id: response.data._id,
        date: new Date(response.data.createdAt).toLocaleString(),
        total: response.data.total,
        items: response.data.products.map((p) => ({
          name: p.product?.name || "Deleted Product",
          quantity: p.quantity,
          price: p.price,
          sku: p.product?._id.slice(-4) || "N/A",
        })),
        customerName: response.data.customerName,
      };

      setLastInvoice(newInvoice);
      setIsModalOpen(true);
      setCart([]);
      setCustomerName("Walk-in Customer");

      fetchProducts();
    } catch (error) {
      console.error("Error creating bill:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create bill. Check stock levels."
      );
    }
  };

  useEffect(() => {
    fetchProducts();

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to barcode scanner server");
      setScannerConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from barcode scanner server");
      setScannerConnected(false);
    });

    // Listen for scanned barcodes
    socketInstance.on("add-to-cart", (data) => {
      console.log("📦 Received barcode from scanner:", data);
      if (data.barcode) {
        addItemByBarcode(data.barcode);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array - only runs once

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Billing Counter</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: scannerConnected ? "#28a745" : "#dc3545",
              display: "inline-block",
            }}
          ></span>
          <span style={{ fontSize: "14px", color: "#666" }}>
            {scannerConnected ? "Scanner Connected" : "Scanner Disconnected"}
          </span>
        </div>
      </div>

      <div className="billing-layout">
        <div className="card">
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter Customer Name (Optional)"
            style={{ marginBottom: "15px" }}
          />

          <h3>Search by Name</h3>

          <form onSubmit={handleAddSelectedToCart}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSku("");
                setSelectedProductFromSearch(null);
              }}
              placeholder="Search by Product Name"
            />

            {searchTerm &&
              filteredProducts.length > 0 &&
              !selectedProductFromSearch && (
                <div
                  className="dropdown-results"
                  style={{
                    border: "1px solid #ddd",
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginBottom: "10px",
                    backgroundColor: "#fff",
                    zIndex: 10,
                  }}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductSelection(product)}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <strong>{product.name}</strong> - Stock:{" "}
                      {product.quantity}
                    </div>
                  ))}
                </div>
              )}

            {selectedProductFromSearch && (
              <p
                style={{
                  marginTop: "5px",
                  padding: "10px",
                  border: "1px solid #28a745",
                  borderRadius: "5px",
                  backgroundColor: "#e9ffe9",
                }}
              >
                <strong>Selected:</strong> {selectedProductFromSearch.name}{" "}
                (Stock: {selectedProductFromSearch.quantity})
              </p>
            )}

            <button type="submit" className="btn-success">
              Add Selected Item
            </button>
          </form>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>

        <div className="card">
          <h3>Current Bill</h3>
          {cart.length === 0 ? (
            <p>No items added yet.</p>
          ) : (
            <div>
              <p>
                Customer: <strong>{customerName}</strong>
              </p>
              <hr />
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <span>
                    {item.name} ({item.category}) x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="cart-total">
                Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>
          )}
          <button
            onClick={handleCheckout}
            style={{ width: "100%", marginTop: "20px" }}
            className="btn-success"
          >
            Confirm Payment & Checkout
          </button>
        </div>
      </div>

      {lastInvoice && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          invoice={lastInvoice}
        />
      )}
    </div>
  );
};

export default BillingCounter;
