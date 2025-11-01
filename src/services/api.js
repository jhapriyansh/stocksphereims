import axios from "axios";

const API_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API 
export const login = (email, password) =>
  api.post("/users/login", { email, password }, { withCredentials: true });
export const register = (userData) => api.post("/users/register", userData);
export const logoutApi = () =>
  api.post("/users/logout", {}, { withCredentials: true });
export const verifyToken = () =>
  api.get("/users/verify", { withCredentials: true });

// NEW User Management API
export const getUsers = () => api.get("/users");
export const registerNewStaff = (userData) => api.post("/users", userData);
export const deleteUser = (id, adminPassword) =>
  api.delete(`/users/${id}`, { data: { adminPassword } });
export const changePasswordApi = (data) => api.put("/users/password", data);


// Products API 
export const getProducts = () => api.get("/products");
export const createProduct = (productData) =>
  api.post("/products", productData);
export const updateProductQuantity = (id, quantityData) => 
  api.put(`/products/${id}/quantity`, quantityData); 
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