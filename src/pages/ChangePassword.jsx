import React, { useState } from "react";
import { changePasswordApi } from "../services/api";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      setIsError(true);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long.");
      setIsError(true);
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage("New password cannot be the same as the old password.");
      setIsError(true);
      return;
    }

    try {
      await changePasswordApi({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setMessage("Password successfully changed!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to change password. Please check your old password."
      );
      setIsError(true);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Old Password:</label>
        <input
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />

        <label>New Password (min 6 characters):</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        <label>Confirm New Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {message && (
          <p style={{ color: isError ? "red" : "green", marginTop: "15px" }}>
            {message}
          </p>
        )}

        <button type="submit" style={{ marginTop: "10px" }}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
