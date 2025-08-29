import React from "react";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Button, Table, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <Card className="p-4 shadow-sm border-0">
      <h2 className="text-center mb-4 text-primary fw-bold">Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          hover
          responsive
          className="table-sm align-middle shadow-sm"
        >
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th className="text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="small">{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>Rs.{order.totalPrice.toLocaleString()}</td>
                <td className="text-center">
                  {order.isPaid ? (
                    <span className="badge bg-success">
                      {order.paidAt.substring(0, 10)}
                    </span>
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td className="text-center">
                  {order.isDelivered ? (
                    <span className="badge bg-warning text-dark">
                      {order.deliveredAt.substring(0, 10)}
                    </span>
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td className="text-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>View Details</Tooltip>}
                  >
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      variant="outline-primary"
                      size="sm"
                      className="rounded-circle shadow-sm btn-hover"
                    >
                      <FaInfoCircle />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default OrderListPage;
