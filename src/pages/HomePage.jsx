import { Row, Col } from "react-bootstrap";

import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  // state to store the products
  const [products, setProducts] = useState([]);

  // useEffect to fetch data
  useEffect(() => {
    const fetchedProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    };
    fetchedProducts();
  }, []);
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products?.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomePage;
