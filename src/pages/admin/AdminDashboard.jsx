import React, { useEffect, useState } from "react";
import {
  getProducts,
  getStockRequests,
  getBills,
  getUsers,
} from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes, bRes, uRes] = await Promise.all([
          getProducts(),
          getStockRequests(),
          getBills(),
          getUsers(),
        ]);
        setInventory(pRes.data || []);
        setStockRequests(rRes.data || []);
        setBills(bRes.data || []);
        setUsers(uRes.data || []);
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

  // Calculate total revenue per day for the last 7 days
  const revenueData = React.useMemo(() => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    const dailyRevenue = bills.reduce((acc, bill) => {
      const date = new Date(bill.createdAt).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = 0;
      const billTotal = bill.products.reduce(
        (sum, p) => sum + p.quantity * p.price,
        0
      );
      acc[date] += billTotal;
      return acc;
    }, {});

    return last7Days.map((date) => ({
      date,
      revenue: dailyRevenue[date] || 0,
    }));
  }, [bills]);

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
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="dashboard-card">
          <h3>Staff Members</h3>
          <p>{users.filter((user) => user.role === "staff").length}</p>
        </div>
      </div>

      <div
        className="revenue-chart"
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Revenue Last 7 Days</h3>
        <LineChart
          width={800}
          height={300}
          data={revenueData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => ["$" + value.toLocaleString(), "Revenue"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            name="Daily Revenue"
            strokeWidth={2}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default AdminDashboard;
