import axios from "axios";

// Backend runs on port 5001 by default (avoid port 5000 system conflicts on macOS)
const API_URL = "http://localhost:5001/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API
export const login = (email, password) =>
  api.post("/users/login", { email, password });
export const register = (userData) => api.post("/users/register", userData);

// Products API
export const getProducts = () => api.get("/products");
export const createProduct = (productData) =>
  api.post("/products", productData);
export const updateProductQuantity = (id, quantity) =>
  api.put(`/products/${id}/quantity`, { quantity });
export const getLowStockProducts = () => api.get("/products/low-stock");

// Bills API
export const createBill = (billData) => api.post("/bills", billData);
export const getBills = () => api.get("/bills");
export const getBillsByDateRange = (startDate, endDate) =>
  api.get("/bills/range", { params: { startDate, endDate } });

// Stock Requests API
export const createStockRequest = (requestData) =>
  api.post("/stock-requests", requestData);
export const getStockRequests = () => api.get("/stock-requests");
export const updateStockRequest = (id, updateData) =>
  api.put(`/stock-requests/${id}`, updateData);

export default api;
