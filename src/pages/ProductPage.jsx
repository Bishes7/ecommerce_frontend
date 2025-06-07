import { Link, useParams } from "react-router-dom";

import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useGetProductsDetailsQuery } from "../slices/productsApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";

const ProductPage = () => {
  const { id: productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductsDetailsQuery(productId);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        <IoMdArrowRoundBack /> Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message || error.message}</Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item> Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>Description:{product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="d-grid">
                  <Button type="button" disabled={product.countInStock === 0}>
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductPage;
6;
