import React from "react";

import KhaltiCheckout from "khalti-checkout-web";
import {
  useCreatePaymentIntentMutation,
  useVerifyPaymentMutation,
} from "../slices/paymentApiSlice";
import { toast } from "react-toastify";

const KhaltiButton = ({ amount, purchaseOrderId, purchaseOrderName }) => {
  const [createKhaltiPayment] = useCreatePaymentIntentMutation();
  const [verifyKhaltiPayment] = useVerifyPaymentMutation();

  const handlePayment = async () => {
    try {
      // 1) Ask backend to create payment; it returns { pidx, payment_url, ... }
      const { pidx, payment_url } = await createKhaltiPayment({
        amount,
        purchaseOrderId,
        purchaseOrderName,
      }).unwrap();

      if (!payment_url) {
        toast.error("Payment URL missing from backend");
        return;
      }

      const checkout = new KhaltiCheckout({
        eventHandler: {
          onSuccess: async () => {
            try {
              const result = await verifyKhaltiPayment({ pidx }).unwrap();
              if (result.status === "Completed") {
                toast.success("Payment verified successfully!");
              } else {
                toast.error("Payment verification failed!");
              }
            } catch (e) {
              console.error("Verify error:", e);
              toast.error("Error verifying payment");
            }
          },
          onError(error) {
            console.error("Khalti error:", error);
            toast.error("Payment failed!");
          },
          onClose() {
            console.log("Khalti widget closed");
          },
        },
      });

      checkout.show({ payment_url });
    } catch (err) {
      // shows any backend/init errors
      console.error("Create Payment Error:", err);
      const msg =
        err?.data?.message || err?.message || "Payment could not be initiated";
      toast.error(msg);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className=" btn btn-primary fw-bold my-2 py-2 rounded"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiButton;
