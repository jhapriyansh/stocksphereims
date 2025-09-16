import React from "react";
import { inventory } from "../../data/mockData";

const InventoryStatus = () => (
  <div className="card">
    <h1>Inventory Status</h1>
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Reorder Point</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={item.sku}>
            <td>{item.sku}</td>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.reorderPoint}</td>
            <td>{item.location}</td>
            <td>
              {item.quantity < item.reorderPoint ? (
                <span style={{ color: "red" }}>Low Stock</span>
              ) : (
                <span style={{ color: "green" }}>In Stock</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default InventoryStatus;
