import React from "react";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { Card, Col, Row } from "react-bootstrap";

export const HotDealsPage = () => {
  const { data, isLoading, error } = useGetProductsQuery({});
  console.log(data);

  const hotDeals =
    data?.products?.filter((p) => p.discountPrice < p.price || p.isFestive) ||
    [];

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
      {hotDeals.map((product) => (
        <Col key={product._id}>
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={product.image} />
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
        </Col>
      ))}
    </Row>
  );
};
