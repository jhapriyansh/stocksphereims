import React, { useState } from "react";
import { inventory, stockRequests } from "../../data/mockData";

const RequestStock = () => {
  const [selectedSku, setSelectedSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = inventory.find((i) => i.sku === selectedSku);
    if (!item) {
      setMessage("Please select a valid item.");
      return;
    }

    const newRequest = {
      id: stockRequests.length + 1,
      itemName: item.name,
      sku: item.sku,
      quantity: parseInt(quantity, 10),
      status: "Pending",
      requestedBy: "staff",
    };

    // NOTE: In a real app, this would be a POST request to an API.
    // For showcase, we just log it and show a success message.
    console.log("New Stock Request:", newRequest);
    setMessage(`Successfully requested ${quantity} of ${item.name}.`);

    // Reset form
    setSelectedSku("");
    setQuantity(1);
  };

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <h1>Request New Stock</h1>
      <form onSubmit={handleSubmit}>
        <label>Select Item:</label>
        <select
          value={selectedSku}
          onChange={(e) => setSelectedSku(e.target.value)}
          required
        >
          <option value="">-- Choose an item --</option>
          {inventory.map((item) => (
            <option key={item.sku} value={item.sku}>
              {item.name} (Current: {item.quantity})
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
      {message && (
        <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
      )}
    </div>
  );
};
export default RequestStock;
