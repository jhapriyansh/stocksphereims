import React, { useState, useEffect } from "react";
import { getProducts, updateProductQuantity } from "../../services/api";

const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    minStockLevel: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      minStockLevel: product.minStockLevel.toString(),
    });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const newQuantity = parseInt(formData.quantity);

      // Update the product quantity only
      await updateProductQuantity(selectedProduct._id, {
        quantity: newQuantity,
      });

      // Refresh products list
      await fetchProducts();
      setSuccess("Product quantity updated successfully");
      setError("");
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.response?.data?.message || "Failed to update product");
      setSuccess("");
    }
  };
  // ... (rest of the component's JSX remains the same)
  return (
    <div className="card">
      <h1>Update Product</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Product List */}
        <div style={{ flex: 1 }}>
          <h3>Select a Product</h3>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {products.map((product) => (
              <div
                key={product._id}
                className={`product-item ${
                  selectedProduct?._id === product._id ? "selected" : ""
                }`}
                onClick={() => handleProductSelect(product)}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  backgroundColor:
                    selectedProduct?._id === product._id ? "#f0f0f0" : "white",
                }}
              >
                <h4>{product.name}</h4>
                <p>Category: {product.category}</p>
                <p>Current Quantity: {product.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Update Form */}
        <div style={{ flex: 1 }}>
          <h3>Update Details</h3>
          {selectedProduct ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="minStockLevel">Minimum Stock Level:</label>
                <input
                  type="number"
                  id="minStockLevel"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled
                />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}

              <button type="submit" className="btn-primary">
                Update Quantity
              </button>
            </form>
          ) : (
            <p>Select a product to update its quantity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
