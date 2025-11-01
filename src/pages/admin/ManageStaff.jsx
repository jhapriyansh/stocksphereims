import React, { useState, useEffect } from "react";
import { getUsers, registerNewStaff, deleteUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ManageStaff = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", adminPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch user list.");
      console.error(err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newUser.name.trim()) {
      setError("Staff name cannot be empty.");
      return;
    }

    try {
      const userData = {
        name: newUser.name.trim(),
        adminPassword: newUser.adminPassword,
      };

      const response = await registerNewStaff(userData);
      const email = response.data.email;
      setSuccess(
        `User ${response.data.name} added. Email: ${email}. Default password: staff123`
      );
      setNewUser({ name: "", adminPassword: "" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user.");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user: ${name}?`)) {
      return;
    }

    const password = prompt("Enter your Admin Password to confirm deletion:");
    if (!password) {
      setError("Admin password required for deletion.");
      return;
    }

    setError("");
    setSuccess("");
    try {
      await deleteUser(id, password);
      setSuccess(`User ${name} successfully deleted.`);
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Deletion failed. Check password."
      );
    }
  };

  return (
    <div>
      <h1>Manage Staff Members</h1>

      <div className="billing-layout">
        {/* ADD USER CARD */}
        <div className="card">
          <h3>Add New Staff Member</h3>
          <form onSubmit={handleAddUser}>
            <label>Staff Name:</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g., Jane Smith"
              required
            />
            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              Email will be: **{newUser.name.toLowerCase().replace(/\s/g, "")}
              @stocksphere.com**
            </p>
            <p style={{ fontSize: "0.8rem", color: "#888" }}>
              Default Password: **staff123**
            </p>

            <label>Your Admin Password (to authorize):</label>
            <input
              type="password"
              value={newUser.adminPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, adminPassword: e.target.value })
              }
              placeholder="Enter your current password"
              required
            />

            <button type="submit" className="btn-success">
              Add Staff
            </button>
          </form>
        </div>

        {/* USER LIST CARD */}
        <div className="card">
          <h3>Existing Users</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>
                    {u._id === user._id ? (
                      <span style={{ color: "gray" }}> (You) </span>
                    ) : (
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        disabled={u.role === "admin"}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
