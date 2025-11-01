import React, { useState, useEffect } from "react";
import { getProducts, createStockRequest } from "../../services/api";

const RequestStock = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedProductId || quantity < 1) {
      setMessage("Please select a valid item and quantity.");
      return;
    }

    try {
      const requestData = {
        product: selectedProductId,
        quantity: parseInt(quantity, 10),
        remarks: remarks,
      };

      await createStockRequest(requestData);

      setMessage(`✅ Successfully requested ${quantity} units.`);

      setSelectedProductId("");
      setQuantity(1);
      setRemarks("");
    } catch (error) {
      console.error("Request failed:", error);
      setMessage(
        `❌ Failed to submit request: ${
          error.response?.data?.message || "Server error"
        }`
      );
    }
  };

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <h1>Request New Stock</h1>
      <form onSubmit={handleSubmit}>
        <label>Select Item:</label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
        >
          <option value="">-- Choose an item --</option>
          {products.map((item) => (
            <option key={item._id} value={item._id}>
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

        <label>Remarks (Optional):</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows="3"
        />

        <button type="submit">Submit Request</button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};
export default RequestStock;
