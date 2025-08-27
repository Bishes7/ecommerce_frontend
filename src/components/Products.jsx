import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded shadow-sm">
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={
            product?.image && product.image.startsWith("/uploads")
              ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
              : product?.image || "/images/placeholder.png"
          }
          className="product-img"
        />
      </Link>

      <Card.Body>
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* Rating */}
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        {/* Price */}
        <Card.Text as="h3">Rs.{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
