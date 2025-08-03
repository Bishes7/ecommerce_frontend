import React from "react";
import { useFetchTopProductsQuery } from "../slices/productsApiSlice";
import { Loader } from "./ui/Loader";
import { Message } from "./ui/Message";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductsCarousel = () => {
  const { data: products, isLoading, error } = useFetchTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-3 custom-carousel ">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className="carousel-img "
            />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductsCarousel;
