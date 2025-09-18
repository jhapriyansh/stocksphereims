import React, { useState } from "react";
import { inventory, bills } from "../../data/mockData";
import InvoiceModal from "../../components/InvoiceModal";

const BillingCounter = () => {
  const [sku, setSku] = useState("");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);

  const handleAddItem = (e) => {
    e.preventDefault();
    setError("");
    const item = inventory.find(
      (i) => i.sku.toLowerCase() === sku.toLowerCase()
    );

    if (item) {
      if (item.quantity > 0) {
        const existingCartItem = cart.find((ci) => ci.sku === item.sku);
        if (existingCartItem) {
          setCart(
            cart.map((ci) =>
              ci.sku === item.sku ? { ...ci, quantity: ci.quantity + 1 } : ci
            )
          );
        } else {
          setCart([...cart, { ...item, quantity: 1 }]);
        }
      } else {
        setError("Item is out of stock!");
      }
    } else {
      setError("Item not found!");
    }
    setSku("");
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError("Cart is empty.");
      return;
    }

    const newInvoice = {
      id: `INV-2025-${(bills.length + 1).toString().padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      items: cart,
      total: calculateTotal(),
    };

    setLastInvoice(newInvoice);
    setIsModalOpen(true);
    setCart([]); 
  };

  return (
    <div>
      <h1>Billing Counter</h1>
      <div className="billing-layout">
        <div className="card">
          <h3>Scan or Enter Item SKU</h3>
          <form onSubmit={handleAddItem}>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g., LP-101"
            />
            <button type="submit">Add to Bill</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="card">
          <h3>Current Bill</h3>
          {cart.length === 0 ? (
            <p>No items added yet.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.sku} className="cart-item">
                  <span>
                    {item.name} x {item.quantity}
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
