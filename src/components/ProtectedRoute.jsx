import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // Get user and loading state from context

  // 1. Handle Loading State
  // If we are still checking the token, render nothing/a spinner
  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator instead of null
  }

  // 2. Handle Unauthenticated State
  // If the user object is null, redirect to login
  if (!user) {
    // If we're not logged in, always send them to the login page.
    return <Navigate to="/login" replace />;
  }

  // 3. Handle Role/Authorization Check (If needed)
  // Check if the required role (string or array) matches the user's role
  const requiredRoles = Array.isArray(role) ? role : [role];
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    // If the user's role doesn't match the required role, redirect to their default dashboard
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/staff/billing';
    return <Navigate to={redirectPath} replace />; 
  }

  // 4. Authorized: Render the requested component
  return children;
};

export default ProtectedRoute;