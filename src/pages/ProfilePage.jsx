import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Card, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  useProfileMutation,
  useUploadImageMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants";

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(userInfo?.avatar || "");

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const [uploadImage] = useUploadImageMutation();

  // Trigger file chooser when clicking the avatar
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      setAvatar(res.image); // store uploaded path
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Handle profile update
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
        avatar,
      }).unwrap();

      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setAvatar(userInfo.avatar || "");
    }
  }, [userInfo]);
  console.log(userInfo);
  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow-lg p-4 rounded profile-card">
          {/* Profile image section */}
          <div className="text-center mb-3">
            <Image
              src={
                avatar
                  ? `${BASE_URL}${avatar}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              roundedCircle
              width="120"
              height="120"
              className="border border-2 border-primary shadow-sm clickable-avatar"
              alt="profile avatar"
              onClick={handleImageClick}
            />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={uploadFileHandler}
            style={{ display: "none" }}
          />

          <h3 className="text-center text-primary fw-bold mb-4">
            User Profile
          </h3>

          {/* Profile Form */}
          <Form onSubmit={submitHandler}>
            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-pill"
              />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group controlId="confirmPassword" className="mb-4">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-pill"
              />
            </Form.Group>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-3 rounded-pill fw-bold shadow-sm btn-hover"
              disabled={loadingUpdateProfile}
            >
              Update Details
            </Button>

            {/* Admin product list shortcut */}
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
