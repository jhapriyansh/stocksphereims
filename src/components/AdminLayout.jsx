import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>StockSphere (Admin)</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="inventory">Inventory Status</NavLink>
            </li>
            <li>
              <NavLink to="update-product">Update Product</NavLink>
            </li>
            <li>
              <NavLink to="requests">Manage Requests</NavLink>
            </li>
            <li>
              <NavLink to="bills">View Bills</NavLink>
            </li>
            <li>
              <NavLink to="analytics">Analytics</NavLink>
            </li>
            <li>
              <NavLink to="manage-staff">Manage Staff</NavLink>
            </li>
            <hr style={{ margin: "10px 0", borderTop: "1px solid #eee" }} />
            <li>
              <NavLink to="/change-password">Change Password</NavLink>
            </li>{" "}
            {/* NEW LINK */}
          </ul>
        </nav>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;
