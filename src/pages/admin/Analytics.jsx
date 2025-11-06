import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getBills } from "../../services/api";

const Analytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await getBills();
        const bills = response.data;

        // Process bills to get product sales data
        const productSales = {};

        bills.forEach((bill) => {
          bill.products.forEach((product) => {
            const productName = product.product.name;
            if (!productSales[productName]) {
              productSales[productName] = 0;
            }
            productSales[productName] += product.quantity;
          });
        });

        // Convert to array and sort by units sold
        const sortedSales = Object.entries(productSales)
          .map(([name, units]) => ({ name, units }))
          .sort((a, b) => b.units - a.units)
          .slice(0, 5); // Get top 5 selling items

        setSalesData(sortedSales);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sales data");
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card">
      <h1>Sales Analytics</h1>

      <div style={{ marginTop: "30px" }}>
        <h4>Top 5 Selling Items</h4>
        <BarChart
          width={600}
          height={300}
          data={salesData}
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
