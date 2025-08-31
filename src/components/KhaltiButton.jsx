import React from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { useCreatePaymentIntentMutation } from "../slices/paymentApiSlice";

const KhaltiButton = ({ amount, purchaseOrderId, purchaseOrderName }) => {
  const [createKhaltiPayment] = useCreatePaymentIntentMutation();
  console.log("Khalti Key:", import.meta.env.VITE_KHALTI_PUBLIC_KEY);

  const handlePayment = async () => {
    try {
      // 1. Create payment intent from backend
      const response = await createKhaltiPayment({
        amount,
        purchaseOrderId,
        purchaseOrderName,
      }).unwrap();

      // 2. Configure Khalti Checkout
      let config = {
        publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
        productIdentity: purchaseOrderId,
        productName: purchaseOrderName,
        productUrl: window.location.href,
        eventHandler: {
          onSuccess(payload) {
            alert("Payment Successful!");
            console.log("Payload:", payload);
          },
          onError(error) {
            alert("Payment Failed!");
            console.error(error);
          },
        },
      };

      // 3. Open Khalti checkout
      let checkout = new KhaltiCheckout(config);
      checkout.show({ amount: amount * 100 }); // convert to paisa
    } catch (err) {
      alert("Failed to create Khalti payment intent");
      console.error(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-dark text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiButton;
