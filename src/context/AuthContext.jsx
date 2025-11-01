import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login as apiLogin, logoutApi, verifyToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password) => {
    try {
      const { data } = await apiLogin(email, password);
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);

      if (data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/staff/billing", { replace: true });
      }
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      if (loading) setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check for persisted user and verify token on initial load
  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem("user");

      console.log("🔍 Verifying session...");
      console.log("Stored user:", storedUser ? "Found" : "Not found");
      console.log("Current path:", location.pathname);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("📝 Parsed user:", parsedUser);

          // Verify token with backend
          console.log("🔐 Calling verifyToken API...");
          const { data } = await verifyToken();
          console.log("✅ Token verified successfully:", data);

          // If verification succeeds, update user data
          const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          };

          setUser(userData);

          // Only redirect if user is on login page or root
          const currentPath = location.pathname;
          const isOnLoginOrRoot =
            currentPath === "/login" || currentPath === "/";

          console.log("Current path:", currentPath);
          console.log("Should redirect:", isOnLoginOrRoot);

          if (isOnLoginOrRoot) {
            const path =
              data.role === "admin" ? "/admin/dashboard" : "/staff/billing";
            console.log("🚀 Redirecting to:", path);
            navigate(path, { replace: true });
          } else {
            console.log("✓ Staying on current page");
          }
        } catch (error) {
          console.error("❌ Session verification failed:", error);
          console.error("Error response:", error.response?.data);

          // If verification fails, clear session and force login
          setUser(null);
          localStorage.removeItem("user");

          // Only navigate to login if not already there
          if (location.pathname !== "/login") {
            console.log("🚀 Redirecting to login");
            navigate("/login", { replace: true });
          }
        }
      } else {
        console.log("❌ No stored user found");
        // No stored user, redirect to login if not already there
        if (location.pathname !== "/login") {
          console.log("🚀 Redirecting to login (no stored user)");
          navigate("/login", { replace: true });
        }
      }

      // Set loading to false once verification check is complete
      setLoading(false);
      console.log("✓ Loading complete");
    };

    verifySession();
  }, []); // Keep empty dependency array - only run on mount

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
