import React, { useState } from "react";
import { stockRequests as initialRequests } from "../../data/mockData";

const ManageRequests = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleStatusChange = (id, newStatus) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.itemName}</td>
              <td>{req.quantity}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "Pending" && (
                  <>
                    <button
                      className="btn-success"
                      onClick={() => handleStatusChange(req.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-danger"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleStatusChange(req.id, "Declined")}
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
