import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: 'Laptop Pro 15"',
    units: 15,
  },
  {
    name: "Wireless Mouse",
    units: 35,
  },
  {
    name: "Mechanical Keyboard",
    units: 22,
  },
];

const Analytics = () => (
  <div className="card">
    <h1>Sales Analytics</h1>

    <div style={{ marginTop: "30px" }}>
      <h4>Top Selling Items</h4>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="units" fill="#8884d8" />
      </BarChart>
    </div>

    <div style={{ marginTop: "30px" }}>
      <h4>Top Selling Items (Details)</h4>
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
