import React from "react";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/productsApiSlice";
import { Button, Col, Nav, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";
import Product from "../../components/Products";

const ProductListPage = () => {
  const { pageNumber, category } = useParams();
  const location = useLocation();

  // Detect admin path
  const isAdmin = location.pathname.startsWith("/admin");

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
    category,
  });

  const [createProduct, { isLoading: loadingProduct }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
        toast.success("Product deleted");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to add the product?")) {
      try {
        await createProduct().unwrap();
        refetch();
        toast.success("Sample product created");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

  return (
    <>
      {isAdmin ? (
        <>
          {/* ---------- ADMIN VIEW ---------- */}
          <Row className="align-items-center">
            <Col>
              <h1>{category ? `Products - ${category}` : "Products"}</h1>
            </Col>
            <Col className="text-end">
              <Button className="btn-sm m-3" onClick={createProductHandler}>
                <FaEdit /> Create Product
              </Button>
            </Col>
          </Row>

          {loadingProduct && <Loader />}
          {loadingDelete && <Loader />}

          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
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

          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      ) : (
        <>
          {/* ---------- PUBLIC CATEGORY VIEW ---------- */}
          <h1>{category ? category.replace("-", " ") : "All Products"}</h1>
          <Row>
            {data?.products?.length > 0 ? (
              data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))
            ) : (
              <Message>No products found in this category.</Message>
            )}
          </Row>

          <Paginate pages={data.pages} page={data.page} category={category} />
        </>
      )}
    </>
  );
};

export default ProductListPage;
