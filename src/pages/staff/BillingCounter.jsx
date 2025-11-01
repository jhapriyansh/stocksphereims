import React, { useState, useEffect, useMemo } from "react";
import { getProducts, createBill } from "../../services/api";
import InvoiceModal from "../../components/InvoiceModal";

const BillingCounter = () => {
  // Original states
  const [sku, setSku] = useState("");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [products, setProducts] = useState([]); // All available products

  // New states for search/dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductFromSearch, setSelectedProductFromSearch] =
    useState(null);

  // New state for customer details
  const [customerName, setCustomerName] = useState("Walk-in Customer");

  useEffect(() => {
    // Initial fetch of products
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      // Filter out items with 0 quantity immediately
      const availableProducts = response.data
        .filter((p) => p.quantity > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Filtered list based on search input (Name or ID)
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];

    const lowerCaseSearch = searchTerm.toLowerCase();

    return products
      .filter(
        (product) =>
          // Search by name or ID
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product._id.toLowerCase().includes(lowerCaseSearch)
      )
      .slice(0, 10); // Limit results
  }, [searchTerm, products]);

  // Logic to update product list after adding an item to the cart (Fixes Bug 2)
  const updateProductsAfterCartAdd = (itemAdded, quantityChange) => {
    setProducts((prevProducts) => {
      return prevProducts
        .map((p) => {
          if (p._id === itemAdded._id) {
            const newQuantity = p.quantity - quantityChange;
            return {
              ...p,
              quantity: newQuantity,
            };
          }
          return p;
        })
        .filter((p) => p.quantity > 0); // Keep filtering out if stock hits 0
    });
  };

  // Handler for adding items (used by both direct SKU input and search dropdown)
  const handleAddItem = (e, itemToAdd = null) => {
    e.preventDefault();
    setError("");

    const item = itemToAdd || products.find((i) => i._id === sku);

    if (item) {
      if (item.quantity > 0) {
        const existingCartItem = cart.find((ci) => ci._id === item._id);

        // Use the quantity from the `products` state for the current check
        const currentStock =
          products.find((p) => p._id === item._id)?.quantity || 0;
        const currentCartCount = existingCartItem
          ? existingCartItem.quantity
          : 0;

        if (currentCartCount + 1 <= currentStock) {
          // 1. Update Cart
          if (existingCartItem) {
            setCart(
              cart.map((ci) =>
                ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
              )
            );
          } else {
            setCart([...cart, { ...item, quantity: 1 }]);
          }

          // 2. Update the available Products list (Fixes Bug 2: real-time stock change)
          updateProductsAfterCartAdd(item, 1);
        } else {
          setError(
            `Not enough stock for ${item.name}! Available: ${currentStock}`
          );
        }
      } else {
        // This case should not happen often due to the initial filter
        setError(`${item.name} is out of stock!`);
      }
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
        customerName: customerName, // Include customer name (Fixes Bug 1)
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
        customerName: response.data.customerName, // Added to modal data
      };

      setLastInvoice(newInvoice);
      setIsModalOpen(true);
      setCart([]);
      setCustomerName("Walk-in Customer"); // Reset customer name

      // Full refresh of product list from server (optional, but safest)
      fetchProducts();
    } catch (error) {
      console.error("Error creating bill:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create bill. Check stock levels."
      );
    }
  };

  return (
    <div>
      <h1>Billing Counter</h1>
      <div className="billing-layout">
        <div className="card">
          {/* Customer Name Field (Fixes Bug 1) */}
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter Customer Name (Optional)"
            style={{ marginBottom: "15px" }}
          />

          <h3>Scan Item ID or Search by Name</h3>

          {/* 1. Search Block (Dropdown) */}
          <form onSubmit={handleAddSelectedToCart}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSku("");
                setSelectedProductFromSearch(null);
              }}
              placeholder="Search by Name or ID"
            />

            {/* Conditional Dropdown Display */}
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
                      <strong>{product.name}</strong> ({product._id.slice(-4)})
                      - Stock: {product.quantity}
                    </div>
                  ))}
                </div>
              )}

            {/* Display Selected Item for Confirmation */}
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
                **Selected:** {selectedProductFromSearch.name} (Stock:{" "}
                {selectedProductFromSearch.quantity})
              </p>
            )}

            <button type="submit" className="btn-success">
              Add Selected Item
            </button>
          </form>

          <hr style={{ margin: "20px 0" }} />

          {/* 2. Direct SKU Block */}
          <form onSubmit={handleAddItem}>
            <input
              type="text"
              value={sku}
              onChange={(e) => {
                setSku(e.target.value);
                setSearchTerm("");
                setSelectedProductFromSearch(null);
              }}
              placeholder="Or Enter Full Product ID (Barcode Scanner)"
            />
            <button type="submit">Add by ID</button>
          </form>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>

        <div className="card">
          <h3>Current Bill</h3>
          {/* ... (Cart rendering remains the same) ... */}
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
