import React from "react";
import { useFetchRevenueStatsQuery } from "../../slices/ordersApiSlice";
import { Loader } from "../ui/Loader";
import { Message } from "../ui/Message";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RevenueAreaChart = () => {
  const { data: statsRevenue, isLoading, error } = useFetchRevenueStatsQuery();

  const chartData = statsRevenue?.map((item) => ({
    date: item._id,
    revenue: item.totalRevenue,
  }));

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danegr">{error}</Message>;
  if (!chartData || chartData.length === 0)
    return <p>No revenue data available</p>;

  return (
    <div style={{ width: "100%", height: 200 }}>
      <h4 className="text-center">Revenue Over Time</h4>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tickFormatter={(str) => str.slice(0, 5)} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3 " />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4caf50"
            fillOpacity={1}
            fill="url(#colorRev)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAreaChart;
