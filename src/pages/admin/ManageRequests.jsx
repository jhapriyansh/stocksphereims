import React, { useState, useEffect } from "react";
import { getStockRequests, updateStockRequest } from "../../services/api";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getStockRequests();
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStockRequest(id, { status: newStatus });
      await fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <div className="card">
      <h1>Manage Stocking Requests</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Requested By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req._id.slice(-6)}</td>
              <td>{req.product ? req.product.name : "Unknown Product"}</td>
              <td>{req.quantity}</td>
              <td>{req.status}</td>
              <td>{req.requestedBy ? req.requestedBy.name : "Unknown User"}</td>
              <td>
                {req.status === "pending" && (
                  <>
                    <button
                      className="btn-success"
                      onClick={() => handleStatusChange(req._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-danger"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleStatusChange(req._id, "rejected")}
                    >
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ManageRequests;
