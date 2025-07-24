import React from "react";
import {
  useCreateProductMutation,
  useGetProductsQuery,
} from "../../slices/productsApiSlice";
import { Button, Col, Nav, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductListPage = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  const [createProduct, { isLoading: loadingProduct }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    console.log("delete", id);
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to add the product?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingProduct && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.Id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Nav.Item
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                    >
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Nav.Item>

                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListPage;
