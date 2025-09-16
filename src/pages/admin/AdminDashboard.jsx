import React from "react";
import { inventory, stockRequests, bills } from "../../data/mockData";

const AdminDashboard = () => {
  const totalStockValue = inventory.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const lowStockItems = inventory.filter(
    (item) => item.quantity < item.reorderPoint
  ).length;
  const pendingRequests = stockRequests.filter(
    (req) => req.status === "Pending"
  ).length;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Inventory Value</h3>
          <p>${totalStockValue.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <h3>Low Stock Items</h3>
          <p>{lowStockItems}</p>
        </div>
        <div className="dashboard-card">
          <h3>Pending Requests</h3>
          <p>{pendingRequests}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Bills</h3>
          <p>{bills.length}</p>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
