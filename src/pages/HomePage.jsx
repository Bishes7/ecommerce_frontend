import { Row, Col } from "react-bootstrap";

import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";

const HomePage = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
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
      )}
    </>
  );
};

export default HomePage;
