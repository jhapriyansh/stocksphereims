import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2>StockSphere</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/admin/inventory">Inventory Status</NavLink>
            </li>
            <li>
              <NavLink to="/admin/requests">Manage Requests</NavLink>
            </li>
            <li>
              <NavLink to="/admin/bills">View Bills</NavLink>
            </li>
            <li>
              <NavLink to="/admin/analytics">Analytics</NavLink>
            </li>
          </ul>
        </nav>
        <button onClick={logout}>Logout</button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
