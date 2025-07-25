import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  const imageSrc =
    product?.image && product.image.startsWith("/uploads")
      ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
      : product?.image || "/images/placeholder.png"; // fallback if undefined

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Img src={imageSrc} variant="top" />

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
