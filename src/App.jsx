import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InventoryStatus from "./pages/admin/InventoryStatus";
import ManageRequests from "./pages/admin/ManageRequests";
import ViewBills from "./pages/admin/ViewBills";
import Analytics from "./pages/admin/Analytics";
import BillingCounter from "./pages/staff/BillingCounter";
import RequestStock from "./pages/staff/RequestStock";
import AdminLayout from "./components/AdminLayout";
import StaffLayout from "./components/StaffLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="inventory" element={<InventoryStatus />} />
        <Route path="requests" element={<ManageRequests />} />
        <Route path="bills" element={<ViewBills />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Staff Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="billing" />} />
        <Route path="billing" element={<BillingCounter />} />
        <Route path="request-stock" element={<RequestStock />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
