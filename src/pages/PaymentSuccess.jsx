import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEsewaStatusQuery } from "../slices/paymentApiSlice";
import { usePayOrderMutation } from "../slices/ordersApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState(null);

  // Get transaction details from session storage
  useEffect(() => {
    const raw = sessionStorage.getItem("esewa_txn");
    if (raw) setParams(JSON.parse(raw));
  }, []);

  // Call API to verify payment
  const { data, isLoading, error } = useEsewaStatusQuery(
    params
      ? {
          total_amount: params.total_amount,
          transaction_uuid: params.transaction_uuid,
        }
      : { total_amount: "", transaction_uuid: "" },
    { skip: !params }
  );

  const [payOrder] = usePayOrderMutation();

  // Mark order as paid if payment successful
  useEffect(() => {
    const run = async () => {
      if (!data || !params) return;
      if (data.status === "COMPLETE") {
        await payOrder({
          orderId: params.orderId,
          details: {
            isPaid: true,
            paymentResult: { id: data.ref_id, status: "COMPLETED" },
          },
        }).unwrap();
        setTimeout(() => navigate(`/order/${params.orderId}`), 2500);
      }
    };
    run().catch(console.error);
  }, [data, params, payOrder, navigate]);

  // Handle missing context
  if (!params)
    return (
      <Message variant="warning">
        Missing transaction context. Please try again.
      </Message>
    );

  // Loading state
  if (isLoading)
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "300px" }}
      >
        <Loader />
        <p className="mt-3 text-muted">Verifying your payment...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "300px" }}
      >
        <XCircle size={64} className="text-danger mb-3" />
        <h4 className="text-danger">Payment Verification Failed</h4>
        <p className="text-muted">
          Please contact support if the amount was deducted.
        </p>
      </div>
    );

  // Success or Failure UI
  return (
    <div className="container py-5 d-flex justify-content-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "15px" }}
      >
        {data?.status === "COMPLETE" ? (
          <>
            <CheckCircle size={70} className="text-success mb-3" />
            <h2 className="fw-bold text-success">Payment Successful</h2>
            <p className="text-muted mb-3">
              Your transaction has been completed successfully.
            </p>

            <div className="bg-light border rounded p-3 text-start mb-3">
              <p>
                <strong>Status:</strong> {data.status}
              </p>
              <p>
                <strong>Ref ID:</strong> {data.ref_id}
              </p>
              <p>
                <strong>Amount:</strong> Rs. {params.total_amount}
              </p>
            </div>

            <button
              className="btn btn-success w-100"
              onClick={() => navigate(`/order/${params.orderId}`)}
            >
              View Order Details
            </button>
          </>
        ) : (
          <>
            <XCircle size={70} className="text-danger mb-3" />
            <h2 className="fw-bold text-danger">Payment Failed</h2>
            <p className="text-muted mb-3">
              There was an issue verifying your transaction. Please try again or
              contact support.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
