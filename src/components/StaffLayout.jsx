import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StaffLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2>StockSphere</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/staff/billing">Billing Counter</NavLink>
            </li>
            <li>
              <NavLink to="/staff/request-stock">Request Stock</NavLink>
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
export default StaffLayout;
