import React from "react";

const Analytics = () => (
  <div className="card">
    <h1>Sales Analytics</h1>
    <p>This is a placeholder for analytics charts and reports.</p>
    <p>
      You can integrate a charting library like Chart.js or Recharts here to
      visualize sales data.
    </p>
    {/* Example of simple visualization */}
    <div style={{ marginTop: "30px" }}>
      <h4>Top Selling Items (Mock)</h4>
      <div style={{ background: "#eee", padding: "10px", borderRadius: "5px" }}>
        <p>
          Laptop Pro 15": <strong>15 units</strong>
        </p>
        <p>
          Wireless Mouse: <strong>35 units</strong>
        </p>
        <p>
          Mechanical Keyboard: <strong>22 units</strong>
        </p>
      </div>
    </div>
  </div>
);
export default Analytics;
