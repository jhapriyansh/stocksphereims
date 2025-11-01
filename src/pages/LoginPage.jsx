import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Destructure the login function

  const handleLogin = async (e) => {
    e.preventDefault();
    // Clear previous errors on every new login attempt
    setError(""); 

    // The actual navigation and success/failure handling is primarily done inside useAuth().login
    const success = await login(email, password);
    
    // If login fails (returns false from the context function), display a generic error.
    if (!success) {
      // Note: If you want specific error messages from the backend, 
      // you must modify the login function in AuthContext to throw the error object.
      setError("Invalid email or password"); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-form card">
        <h2>StockSphere Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password" // Removed "(password)" placeholder for security best practice
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;