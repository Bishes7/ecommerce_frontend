import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} from "../../slices/usersApiSlice";
import FormContainer from "../../components/FormContainer";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Button, Form, Card, Image } from "react-bootstrap";
import { toast } from "react-toastify";

const EditUserPage = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserDetailsMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3 btn-sm">
        Go Back
      </Link>
      <FormContainer>
        <Card className="shadow-lg p-4 rounded profile-card">
          {/* Profile Image */}
          <div className="text-center mb-3">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              roundedCircle
              width="100"
              height="100"
              className="border border-2 border-primary shadow-sm"
              alt="profile avatar"
            />
          </div>

          <h3 className="text-center mb-4 text-primary fw-bold">Edit User</h3>

          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-pill"
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label className="fw-semibold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-pill"
                />
              </Form.Group>

              <Form.Group controlId="isAdmin" className="mb-4">
                <Form.Check
                  type="checkbox"
                  label="Admin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="fw-semibold"
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loadingUpdate}
                variant="primary"
                className="w-100 rounded-pill fw-bold shadow-sm btn-hover"
              >
                Update User
              </Button>
            </Form>
          )}
        </Card>
      </FormContainer>
    </>
  );
};

export default EditUserPage;
