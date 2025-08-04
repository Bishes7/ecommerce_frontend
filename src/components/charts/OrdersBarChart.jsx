import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useFetchProductStatsQuery } from "../../slices/productsApiSlice";
import { Loader } from "../ui/Loader";
import { Message } from "../ui/Message";

const OrdersBarChart = () => {
  const { data: stats, isLoading, error } = useFetchProductStatsQuery();

  //   prepare chart data
  const chartData = stats
    ?.filter((item) => item._id !== "Sample category")
    .map((item) => ({
      category: item._id,
      count: item.count,
    }));

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );

  return (
    <div style={{ width: "30%", height: 250 }}>
      <h4 className="text-center">Products per Category</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersBarChart;
