import React from "react";
import { useFetchOrderStatsQuery } from "../../slices/ordersApiSlice";
import { Loader } from "../ui/Loader";
import { Message } from "../ui/Message";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OrdersPerDayChart = () => {
  const { data: stats, isLoading, error } = useFetchOrderStatsQuery();

  console.log(stats);

  const chartData = stats?.map((item) => ({
    date: item._id,
    count: item.count,
  }));

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        // margin: "1rem auto",
        height: "200px",
      }}
    >
      <h4 className="text-center">Orders Per Day</h4>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(str) => str.slice(0, 5)} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#82ca9d"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersPerDayChart;
