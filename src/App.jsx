import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import StaffLayout from "./components/StaffLayout";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InventoryStatus from "./pages/admin/InventoryStatus";
import ManageRequests from "./pages/admin/ManageRequests";
import ViewBills from "./pages/admin/ViewBills";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Analytics from "./pages/admin/Analytics";
import BillingCounter from "./pages/staff/BillingCounter";
import RequestStock from "./pages/staff/RequestStock";
import ManageStaff from "./pages/admin/ManageStaff";
import ChangePassword from "./pages/ChangePassword";
import MobileScanner from "./pages/MobileScanner";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES - NO AUTH NEEDED */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/scanner" element={<MobileScanner />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* PROTECTED ROUTES - AUTH REQUIRED */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute role={["admin", "staff"]}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

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
        <Route path="update-product" element={<UpdateProduct />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="manage-staff" element={<ManageStaff />} />
      </Route>

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
