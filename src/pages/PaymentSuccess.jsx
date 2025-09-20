import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useEsewaStatusQuery,
  useVerifyPaymentMutation,
} from "../slices/paymentApiSlice";

import { usePayOrderMutation } from "../slices/ordersApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useState(null);
  const [gateway, setGateway] = useState(null);

  // Detect payment source
  useEffect(() => {
    // Esewa uses session storage
    const rawEsewa = sessionStorage.getItem("esewa_txn");

    // Khalti sends ?pidx=xxxx in return_url
    const query = new URLSearchParams(location.search);
    const pidx = query.get("pidx");

    if (rawEsewa) {
      setGateway("esewa");
      setParams(JSON.parse(rawEsewa));
    } else if (pidx) {
      setGateway("khalti");
      setParams({ pidx }); // only need pidx
    }
  }, [location.search]);

  // API Hooks
  const {
    data: esewaData,
    isLoading: esewaLoading,
    error: esewaError,
  } = useEsewaStatusQuery(
    params && gateway === "esewa"
      ? {
          total_amount: params.total_amount,
          transaction_uuid: params.transaction_uuid,
        }
      : { total_amount: "", transaction_uuid: "" },
    { skip: gateway !== "esewa" }
  );

  const [
    verifyKhalti,
    { data: khaltiData, isLoading: khaltiLoading, error: khaltiError },
  ] = useVerifyPaymentMutation();

  const [payOrder] = usePayOrderMutation();

  // Auto verify Khalti once pidx is available
  useEffect(() => {
    const run = async () => {
      if (gateway === "khalti" && params?.pidx) {
        try {
          const result = await verifyKhalti({ pidx: params.pidx }).unwrap();

          if (result.status === "Completed") {
            await payOrder({
              orderId: result.purchase_order_id, // 👈 use orderId from Khalti response
              details: {
                isPaid: true,
                paymentResult: {
                  id: result.transaction_id || result.pidx,
                  status: "COMPLETED",
                },
              },
            }).unwrap();

            setTimeout(
              () => navigate(`/order/${result.purchase_order_id}`),
              2500
            );
          }
        } catch (err) {
          console.error("Khalti verify failed:", err);
        }
      }
    };
    run();
  }, [gateway, params, verifyKhalti, payOrder, navigate]);

  // Mark order paid for eSewa
  useEffect(() => {
    const run = async () => {
      if (gateway === "esewa" && esewaData && params) {
        if (esewaData.status === "COMPLETE") {
          await payOrder({
            orderId: params.orderId,
            details: {
              isPaid: true,
              paymentResult: { id: esewaData.ref_id, status: "COMPLETED" },
            },
          }).unwrap();
          setTimeout(() => navigate(`/order/${params.orderId}`), 2500);
        }
      }
    };
    run().catch(console.error);
  }, [gateway, esewaData, params, payOrder, navigate]);

  // Missing context
  if (!params)
    return (
      <Message variant="warning">
        Missing transaction context. Please try again.
      </Message>
    );

  const loading = gateway === "esewa" ? esewaLoading : khaltiLoading;
  const error = gateway === "esewa" ? esewaError : khaltiError;
  const data = gateway === "esewa" ? esewaData : khaltiData;

  // Loading state
  if (loading)
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

  // UI
  return (
    <div className="container py-5 d-flex justify-content-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "15px" }}
      >
        {data?.status === "COMPLETE" || data?.status === "Completed" ? (
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
                <strong>Ref ID:</strong> {data.ref_id || data.transaction_id}
              </p>
              <p>
                <strong>Amount:</strong> Rs.{" "}
                {data.total_amount || params.total_amount}
              </p>
            </div>

            <button
              className="btn btn-success w-100"
              onClick={() =>
                navigate(`/order/${data.purchase_order_id || params.orderId}`)
              }
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
