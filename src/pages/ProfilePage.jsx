import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Card, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow-lg p-4 rounded profile-card">
          {/* Profile image */}
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

          <h3 className="text-center text-primary fw-bold mb-4">
            User Profile
          </h3>

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label className="fw-semibold">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
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

            <Form.Group controlId="password" className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-pill"
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-4">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-pill"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-3 rounded-pill fw-bold shadow-sm btn-hover"
              disabled={loadingUpdateProfile}
            >
              Update Details
            </Button>

            <Link to="/admin/productlist">
              <Button
                variant="secondary"
                className="w-100 rounded-pill fw-bold shadow-sm btn-hover"
              >
                Edit Products
              </Button>
            </Link>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;
