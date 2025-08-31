import React, { useState } from "react";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../slices/usersApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Error sending email");
    }
  };

  return (
    <div className="forgot-container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card shadow-lg p-4 rounded-3"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-3 text-primary fw-bold">
          Forgot Password
        </h2>
        <p className="text-center text-muted mb-4">
          Enter your email to receive a password reset link.
        </p>

        {isLoading && <Loader />}
        {error && (
          <Message variant="danger">
            {error?.data?.message || "Something went wrong."}
          </Message>
        )}

        <form onSubmit={submitHandler}>
          <input
            type="email"
            className="form-control my-3 p-2"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none text-secondary">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
