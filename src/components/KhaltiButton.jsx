import React from "react";
import { toast } from "react-toastify";
import { useCreatePaymentIntentMutation } from "../slices/paymentApiSlice";

const KhaltiButton = ({ amount, orderId }) => {
  const [createKhaltiPayment] = useCreatePaymentIntentMutation();

  const handlePay = async () => {
    try {
      const result = await createKhaltiPayment({
        amount,
        purchaseOrderId: orderId,
        purchaseOrderName: `Order #${orderId}`,
      }).unwrap();

      if (result.payment_url) {
        window.location.href = result.payment_url; // Redirect to Khalti
      } else {
        toast.error("Failed to get Khalti payment link");
      }
    } catch (err) {
      console.error("Khalti button error:", err);
      toast.error(err?.data?.message || "Payment initiation failed");
    }
  };

  return (
    <button onClick={handlePay} className="btn btn-success ">
      Pay with Khalti
    </button>
  );
};

export default KhaltiButton;
