import React from "react";
import { useFetchTopProductsQuery } from "../slices/productsApiSlice";
import { Loader } from "./ui/Loader";
import { Message } from "./ui/Message";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHandPointDown } from "react-icons/fa";

const ProductsCarousel = () => {
  const { data: products = [], isLoading, error } = useFetchTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error)
    return <Message variant="danger">{error?.data || "Error"}</Message>;

  // Helper for product images (works for /uploads or absolute urls)
  const getImg = (p) =>
    p.image?.startsWith("/uploads")
      ? `${import.meta.env.VITE_API_BASE_URL}${p.image}`
      : p.image || "/images/placeholder.jpg";

  return (
    <Carousel
      pause="hover"
      interval={4500}
      fade
      className="custom-carousel mb-4"
    >
      {/* 1) FESTIVE SLIDE (always first) */}
      <Carousel.Item>
        <div className="carousel-content festive-hero ">
          <div className="carousel-left d-none d-md-flex justify-content-center align-items-center ">
            <img
              src="/festive/all.png"
              alt="Dashain & Tihar Offers"
              className="carousel-img festive-art"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
          </div>
          <div className="carousel-right">
            <span className="badge bg-warning text-dark mb-2">
              Limited Time
            </span>
            <h2 className="fw-bold lh-tight mb-2">
              Dashain & Tihar <span className="text-gradient">Mega Sale</span>
            </h2>
            <p className="text-danger mb-2   fw-bold">
              Up to <strong>30% OFF</strong> on Phones, TVs & Appliances. .
            </p>
            <p className="mb-3 fw-semibold">
              डसैं–तिहार विशेष छुट! आजै अर्डर गर्नुहोस्।
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <button disabled className="btn btn-danger btn-lg d">
                Shop Offers <FaHandPointDown />
              </button>
              <Link to="/hot-deals" className="btn btn-outline-warning">
                View Hot Deals
              </Link>
            </div>
          </div>
        </div>
      </Carousel.Item>

      {/* 2) PRODUCT SLIDES */}
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <div className="carousel-content">
            <div className="carousel-left">
              <Image
                src={getImg(product)}
                alt={product.name}
                className="carousel-img"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.jpg";
                }}
              />
              {/* Optional festive ribbon on discounted items */}
              {product.isFestive && (
                <span className="festive-ribbon">Dashain Deal</span>
              )}
            </div>

            <div className="carousel-right">
              <h3 className="mb-2">{product.name}</h3>

              <div className="d-flex align-items-baseline gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-muted text-danger">
                      Rs.{product.price}
                    </span>
                    <span className="price price-discount">
                      Rs.{product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="price text-danger">Rs.{product.price}</span>
                )}
              </div>

              <Link
                to={`/product/${product._id}`}
                className="btn btn-primary mt-3"
              >
                View Details
              </Link>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductsCarousel;
