import React from "react";

import { Card, Col, Row } from "react-bootstrap";

import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { useFetchHotDealsQuery } from "../slices/productsApiSlice";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export const HotDealsPage = () => {
  const { data: products, isLoading, error } = useFetchHotDealsQuery();

  const hotDeals = products?.filter(
    (p) => p.isFestive === true || p.discountPrice > 0
  );

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!hotDeals?.length)
    return <Message>No Hot Deals available right now 🎉</Message>;

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
      {hotDeals.map((product) => (
        <Col key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={product.image}
                className="product-img"
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <div className="d-flex align-items-center-baseline gap-2 mb-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-muted text-decoration-line-through">
                        Rs.{product.price}
                      </span>
                      <span className="fw-bold text-danger">
                        Rs.{product.discountPrice}
                      </span>
                    </>
                  ) : (
                    <span className="fw-bold">Rs. {product.price}</span>
                  )}
                </div>

                {product.isFestive && (
                  <div className="small text-success">🎉 Festival Deal</div>
                )}
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};
