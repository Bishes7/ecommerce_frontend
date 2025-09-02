// src/pages/OrderPage.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";

import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import EsewaButton from "../components/ESewaButton";
// If you also want to keep Khalti, import it here:
// import KhaltiButton from "../components/KhaltiButton";

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const markPaidHandler = async () => {
    try {
      await payOrder({
        orderId,
        details: {
          isPaid: true,
          paymentResult: { id: "OFFLINE", status: "COMPLETED" },
        },
      }).unwrap();
      await refetch();
      toast.success("Order marked as paid");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      await refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return <Message variant="danger">Failed to load order details</Message>;

  return (
    <>
      <h2>Order ID: {order._id}</h2>
      <p>Total: Rs. {order.totalPrice}</p>

      {!order.isPaid && (
        <div className="d-flex gap-2 mb-3">
          <EsewaButton amount={order.totalPrice} orderId={order._id} />
          {/* Keep Khalti if you want both
          <KhaltiButton
            amount={order.totalPrice}
            purchaseOrderId={order._id}
            purchaseOrderName="B&B Electronics order"
          /> */}
        </div>
      )}

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping Details</h2>
              <p>
                <strong>Name: </strong> {order.user?.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user?.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress?.address}, {order.shippingAddress?.city}{" "}
                {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on{" "}
                  {order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleString()
                    : "—"}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on{" "}
                  {order.paidAt ? new Date(order.paidAt).toLocaleString() : "—"}
                </Message>
              ) : (
                <>
                  <Message variant="danger">Not Paid</Message>
                  {/* Optional inline button if you prefer it inside this card:
                  <EsewaDemoButton amount={order.totalPrice} orderId={order._id} /> */}
                </>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems?.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={
                          item?.image && item.image.startsWith("/uploads")
                            ? `${import.meta.env.VITE_API_BASE_URL}${
                                item.image
                              }`
                            : item?.image || "/images/placeholder.png"
                        }
                        alt={item.name}
                        className="product-img"
                        fluid
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x Rs.{item.price} = Rs.
                      {(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

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

              {(loadingPay || loadingDeliver) && (
                <ListGroup.Item>
                  <Loader />
                </ListGroup.Item>
              )}

              {/* Admin actions */}
              {userInfo?.isAdmin && !order.isPaid && (
                <ListGroup.Item>
                  <Button className="w-100" onClick={markPaidHandler}>
                    Mark as Paid (offline)
                  </Button>
                </ListGroup.Item>
              )}

              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button className="w-100" onClick={deliverOrderHandler}>
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
