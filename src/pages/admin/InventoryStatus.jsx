import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { getProducts, createProduct } from "../../services/api";
import "./InventoryStatus.css";

const AddItemModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    minStockLevel: "",
  });

  useImperativeHandle(ref, () => ({
    setIsOpen,
  }));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        minStockLevel: parseInt(formData.minStockLevel),
      });
      setIsOpen(false);
      props.onProductAdded();
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        minStockLevel: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Item</h2>
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="code">Code (Alphanumeric):</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              pattern="[A-Za-z0-9]+"
              required
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Initial Quantity:</label>
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
            />
          </div>
          <div className="modal-actions">
            <button type="submit">Add Item</button>
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

const InventoryStatus = () => {
  const modalRef = React.useRef();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="card">
      <div className="header-actions">
        <h1>Inventory Status</h1>
        <button
          onClick={() => modalRef.current.setIsOpen(true)}
          className="add-button"
        >
          Add Item
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Min Stock Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>{item.minStockLevel}</td>
              <td>
                {item.quantity < item.minStockLevel ? (
                  <span style={{ color: "red" }}>Low Stock</span>
                ) : (
                  <span style={{ color: "green" }}>In Stock</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddItemModal ref={modalRef} onProductAdded={fetchProducts} />
    </div>
  );
};

export default InventoryStatus;
