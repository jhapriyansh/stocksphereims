import React, { useEffect, useState } from "react";
import { getProducts, getStockRequests, getBills } from "../../services/api";

const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes, bRes] = await Promise.all([
          getProducts(),
          getStockRequests(),
          getBills(),
        ]);
        setInventory(pRes.data || []);
        setStockRequests(rRes.data || []);
        setBills(bRes.data || []);
      } catch (err) {
        // keep silent for now; components can show nothing
        console.error("Failed to load dashboard data", err);
      }
    };
    load();
  }, []);

  const totalStockValue = inventory.reduce(
    (acc, item) => acc + item.quantity * (item.price || 0),
    0
  );
  const lowStockItems = inventory.filter(
    (item) => item.quantity < (item.minStockLevel || 0)
  ).length;
  const pendingRequests = stockRequests.filter(
    (req) => req.status === "pending"
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
