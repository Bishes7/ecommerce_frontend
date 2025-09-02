import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { useEsewaStatusQuery } from "../slices/paymentApiSlice";
import { usePayOrderMutation } from "../slices/ordersApiSlice";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("esewa_txn");
    if (raw) {
      setParams(JSON.parse(raw));
    }
  }, []);

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

  if (!params)
    return (
      <Message variant="warning">
        Missing transaction context. Please try again.
      </Message>
    );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader />
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <XCircle className="text-red-500" size={64} />
        <p className="mt-4 text-red-600 font-semibold">
          Failed to verify your payment. Please contact support.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="flex flex-col items-center text-center bg-white shadow-md rounded-2xl p-6 w-full max-w-md"
      >
        {data?.status === "COMPLETE" ? (
          <>
            <CheckCircle className="text-green-500" size={72} />
            <h2 className="mt-4 text-2xl font-bold text-green-700">
              Payment Successful!
            </h2>
            <p className="text-gray-700 mt-2">
              Your transaction has been completed successfully.
            </p>
            <div className="bg-gray-50 border rounded-md mt-4 p-4 w-full">
              <p>
                <strong>Status:</strong> {data?.status}
              </p>
              <p>
                <strong>Ref ID:</strong> {data?.ref_id}
              </p>
              <p>
                <strong>Amount:</strong> Rs. {params?.total_amount}
              </p>
            </div>
            <button
              onClick={() => navigate(`/order/${params.orderId}`)}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              View Order Details
            </button>
          </>
        ) : (
          <>
            <XCircle className="text-red-500" size={72} />
            <h2 className="mt-4 text-2xl font-bold text-red-700">
              Payment Failed
            </h2>
            <p className="text-gray-700 mt-2">
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
