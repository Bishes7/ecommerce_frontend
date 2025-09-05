import React, { useState } from "react";
import { Button, Col, Form, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { paymentMethodInfo } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    dispatch(paymentMethodInfo(paymentMethod));
    navigate("/place-order");
  };

  const paymentOptions = [
    { name: "eSewa", description: "Fast and secure wallet payment." },
    { name: "Khalti", description: "Popular payment gateway in Nepal." },
    { name: "Cash on Delivery", description: "Pay when your order arrives." },
  ];

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h2 className="fw-bold text-primary">Choose Your Payment Method</h2>
        <p className="text-muted">
          Select a preferred payment option to complete your order securely.
        </p>
      </motion.div>

      <Card
        className="shadow-lg p-4 rounded border-0"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Col>
              {paymentOptions.map((method) => (
                <motion.div
                  key={method.name}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 border rounded mb-3 d-flex justify-content-between align-items-center ${
                    paymentMethod === method.name
                      ? "bg-primary bg-opacity-10 border-primary"
                      : "bg-light"
                  }`}
                >
                  <Form.Check
                    type="radio"
                    id={method.name.toLowerCase().replace(/\s+/g, "-")}
                    name="paymentMethod"
                    value={method.name}
                    checked={paymentMethod === method.name}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="me-3"
                  />
                  <div>
                    <strong>{method.name}</strong>
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {method.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </Col>
          </Form.Group>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-3 py-2 fw-bold"
            >
              Continue
            </Button>
          </motion.div>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentPage;
