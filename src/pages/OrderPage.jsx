import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../slices/ordersApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import KhaltiButton from "../components/KhaltiButton";

const OrderPage = ({ orders }) => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">Failed to load order details</Message>
  ) : (
    <>
      <h2>Order ID: {order._id}</h2>
      <p>Total: Rs. {order.totalPrice}</p>
      <KhaltiButton
        amount={order.totalPrice}
        purchaseOrderId={order._id}
        purchaseOrderName="B&B Electronics order"
      />
      <Row>
        {/* Left column */}
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping Info */}
            <ListGroup.Item>
              <h2>Shipping Details</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            {/* Payment Method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}

              {/* Conditional Buttons for Payment Methods */}
              {!order.isPaid && order.paymentMethod === "eSewa" && (
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={() =>
                    alert("eSewa payment integration coming soon!")
                  }
                >
                  Pay with eSewa
                </Button>
              )}

              {!order.isPaid && order.paymentMethod === "Khalti" && (
                <Button
                  variant="info"
                  className="mt-2"
                  onClick={() =>
                    alert("Khalti payment integration coming soon!")
                  }
                >
                  Pay with Khalti
                </Button>
              )}

              {(!order.isPaid && order.paymentMethod === "COD") ||
                (order.paymentMethod === "Cash on Delivery" && (
                  <Card className="mt-2 p-3" style={{ background: "#eaf6ff" }}>
                    <h5>Dear {userInfo.name},</h5>
                    <p>
                      Thank you very much for shopping with us. We will contact
                      you soon to confirm your order.
                    </p>
                    <p>
                      If you have any queries, please call us on{" "}
                      <strong>9808007257</strong> /<strong>9841578991s</strong>.
                    </p>
                  </Card>
                ))}
            </ListGroup.Item>

            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={
                          item?.image && item.image.startsWith("/uploads")
                            ? `${import.meta.env.VITE_API_BASE_URL}${
                                item.image
                              }`
                            : item?.image || "/images/placeholder.png"
                        }
                        className="product-img"
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Right column - Order Summary */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs.{order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs.{order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>Rs.{order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>Total</Col>
                  <Col>Rs.{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* Admin Delivery Button */}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderPage;
