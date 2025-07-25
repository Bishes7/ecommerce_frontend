import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetProductsDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import FormContainer from "../../components/FormContainer";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const EditProductPage = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingImage }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product successfully updated");
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Enter products name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                placeholder="Enter price"
                onChange={(e) => setPrice(e.target.value)}
              />
              <Form.Group controlId="image" className="my-2">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />

                <Form.Control
                  type="file"
                  label="Choose file"
                  onChange={uploadFileHandler}
                />
              </Form.Group>
            </Form.Group>
            <Form.Group className="my-2" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={brand}
                placeholder="Enter brand name"
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                placeholder="Enter countInStock"
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                placeholder="Enter products category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="my-2" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                placeholder="Enter Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditProductPage;
