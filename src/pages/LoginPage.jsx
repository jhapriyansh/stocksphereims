import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form card">
        <h2>StockSphere Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username (admin or staff)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (password)"
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
