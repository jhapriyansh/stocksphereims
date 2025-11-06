import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getBills, getBillsByDateRange } from "../../services/api";

const CustomXAxisTick = ({ x, y, payload }) => {
  // Split text into multiple lines if longer than 15 characters
  const words = payload.value.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if (currentLine.length + word.length > 15) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine.length === 0 ? "" : " ") + word;
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 20}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={12}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const Analytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await getBillsByDateRange(startDate, endDate);
        const bills = response.data;

        // Process bills to get product sales data and daily revenue
        const productSales = {};
        const dailyRevenue = {};

        bills.forEach((bill) => {
          const date = new Date(bill.createdAt).toISOString().split("T")[0];
          if (!dailyRevenue[date]) dailyRevenue[date] = 0;

          bill.products.forEach((product) => {
            const productName = product.product.name;
            if (!productSales[productName]) {
              productSales[productName] = 0;
            }
            productSales[productName] += product.quantity;
            dailyRevenue[date] += product.quantity * product.price;
          });
        });

        // Convert to array and sort by units sold
        const sortedSales = Object.entries(productSales)
          .map(([name, units]) => ({ name, units }))
          .sort((a, b) => b.units - a.units)
          .slice(0, 5); // Get top 5 selling items

        // Convert daily revenue to array and sort by date
        const revenueDataArray = Object.entries(dailyRevenue)
          .map(([date, amount]) => ({ date, revenue: amount }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setSalesData(sortedSales);
        setRevenueData(revenueDataArray);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sales data");
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card">
      <h1>Sales Analytics</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>Revenue Over Time</h4>
        <LineChart
          width={800}
          height={300}
          data={revenueData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => ["$" + value.toLocaleString(), "Revenue"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            name="Daily Revenue"
            strokeWidth={2}
          />
        </LineChart>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>Top 5 Selling Items</h4>
        <BarChart
          width={800}
          height={400}
          data={salesData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          barGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            height={60}
            tick={<CustomXAxisTick />}
          />
          <YAxis
            label={{
              value: "Units Sold",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="units" fill="#8884d8" name="Units Sold" />
        </BarChart>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>Top Selling Items (Details)</h4>
        <div
          style={{ background: "#eee", padding: "10px", borderRadius: "5px" }}
        >
          {salesData.map((item, index) => (
            <p key={index}>
              {item.name}: <strong>{item.units} units</strong>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
