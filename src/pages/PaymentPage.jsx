import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { paymentMethodInfo } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";

/**
 * PaymentPage Component
 * Allows users to select a payment method and proceed to the order page.
 */
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

    // Save the chosen payment method in Redux state
    dispatch(paymentMethodInfo(paymentMethod));
    navigate("/place-order");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3 text-center">Select Payment Method</h2>

      <Form
        onSubmit={submitHandler}
        className="payment-form p-4 shadow-sm rounded bg-light"
      >
        <Form.Group>
          <Form.Label as="legend" className="fw-bold">
            Available Methods
          </Form.Label>
          <Col>
            {["eSewa", "Khalti", "Cash on Delivery"].map((method) => (
              <Form.Check
                key={method}
                type="radio"
                className="my-2"
                label={method}
                id={method.toLowerCase().replace(/\s+/g, "-")}
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            ))}
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default PaymentPage;
