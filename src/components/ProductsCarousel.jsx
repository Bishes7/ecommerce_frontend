import React from "react";
import { useFetchTopProductsQuery } from "../slices/productsApiSlice";
import { Loader } from "./ui/Loader";
import { Message } from "./ui/Message";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductsCarousel = () => {
  const { data: products, isLoading, error } = useFetchTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error)
    return <Message variant="danger">{error?.data || "Error"} </Message>;

  return (
    <Carousel
      pause="hover"
      interval={4000}
      fade
      className="custom-carousel mb-4"
    >
      {products.map((product) => {
        const img = product.image?.startsWith("/uploads")
          ? `${import.meta.env.VITE_API_BASE_URL}${product.image}`
          : product.image || "/images/placeholder.jpg";

        return (
          <Carousel.Item key={product._id}>
            <div className="carousel-content">
              <div className="carousel-left">
                <Image src={img} alt={product.name} className="carousel-img" />
              </div>
              <div className="carousel-right">
                <h3>{product.name}</h3>
                <p className="price">Rs.{product.price}</p>
                <Link
                  to={`/product/${product._id}`}
                  className="btn btn-primary mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default ProductsCarousel;
