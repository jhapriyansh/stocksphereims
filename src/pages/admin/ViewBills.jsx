import React from "react";
import { bills } from "../../data/mockData";

const ViewBills = () => (
  <div className="card">
    <h1>All Bills</h1>
    <table>
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Date</th>
          <th>Total Amount</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((bill) => (
          <tr key={bill.id}>
            <td>{bill.id}</td>
            <td>{bill.date}</td>
            <td>${bill.total.toFixed(2)}</td>
            <td>{bill.items.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default ViewBills;
