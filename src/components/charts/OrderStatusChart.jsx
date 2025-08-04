import React from "react";
import { useFetchOrderStatusStatsQuery } from "../../slices/ordersApiSlice";
import { Loader } from "../ui/Loader";
import { Message } from "../ui/Message";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#00BCD4", "#9C27B0"];

const OrderStatusChart = () => {
  const {
    data: statusStats,
    isLoading,
    error,
  } = useFetchOrderStatusStatsQuery();

  const pieData = statusStats?.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!pieData || pieData.length === 0) return <p>No status data available</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h4 className="text-center">Order Status Chart</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusChart;
