import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { useEsewaStatusQuery } from "../slices/paymentApiSlice";
import { usePayOrderMutation } from "../slices/ordersApiSlice";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState(null);

  useEffect(() => {
    // we saved this right before redirecting to eSewa
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
      : // don't call until params is ready
        { total_amount: "", transaction_uuid: "" },
    { skip: !params }
  );

  const [payOrder] = usePayOrderMutation();

  useEffect(() => {
    const run = async () => {
      if (!data || !params) return;
      if (data.status === "COMPLETE") {
        // mark paid in your system (offline or generic)
        await payOrder({
          orderId: params.orderId,
          details: {
            isPaid: true,
            paymentResult: { id: "ESEWA_RC", status: "COMPLETED" },
          },
        }).unwrap();
        // go back to order page
        navigate(`/order/${params.orderId}`);
      }
    };
    run().catch(console.error);
  }, [data, params, payOrder, navigate]);

  if (!params)
    return <Message variant="warning">Missing transaction context.</Message>;
  if (isLoading) return <Loader />;
  if (error)
    return <Message variant="danger">Failed to verify payment.</Message>;

  return (
    <div className="container py-4">
      <h3>Verifying payment…</h3>
      <p>Status: {data?.status}</p>
      {data?.ref_id && <p>Ref ID: {data.ref_id}</p>}
    </div>
  );
};

export default PaymentSuccess;
