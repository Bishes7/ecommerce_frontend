import React from "react";
import OrdersBarChart from "../../components/charts/OrdersBarChart";
import OrdersPerDayChart from "../../components/charts/OrdersPerDayChart";
import OrderStatusChart from "../../components/charts/OrderStatusChart";
import RevenueAreaChart from "../../components/charts/RevenueAreaChart";

const AdminDashBoard = () => {
  return (
    <div className="dashboard">
      <div className="chart-row">
        <OrdersBarChart />;
        <OrdersPerDayChart />
      </div>

      <div className="chart-row">
        <OrderStatusChart />
        <RevenueAreaChart />
      </div>
    </div>
  );
};

export default AdminDashBoard;
