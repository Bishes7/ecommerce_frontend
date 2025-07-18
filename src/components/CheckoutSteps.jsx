import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="mb-5 d-flex justify-content-center">
      <Nav>
        <Nav.Item>
          {step1 ? (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Login</Nav.Link>
          )}
        </Nav.Item>

        <Nav.Item>
          {step2 ? (
            <Nav.Link as={Link} to="/shipping">
              Shipping
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Shipping</Nav.Link>
          )}
        </Nav.Item>
        <Nav.Item>
          {step3 ? (
            <Nav.Link as={Link} to="/payment">
              Payment
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Payment</Nav.Link>
          )}
        </Nav.Item>
        <Nav.Item>
          {step4 ? (
            <Nav.Link as={Link} to="/place-order">
              Place Order
            </Nav.Link>
          ) : (
            <Nav.Link disabled>Place Order</Nav.Link>
          )}
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default CheckoutSteps;
