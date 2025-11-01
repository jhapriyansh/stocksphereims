import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StaffLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>StockSphere (Staff)</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="billing">Billing Counter</NavLink>
            </li>
            <li>
              <NavLink to="request-stock">Request Stock</NavLink>
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
export default StaffLayout;
