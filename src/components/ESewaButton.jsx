import React from "react";
import { useEsewaInitiateMutation } from "../slices/paymentApiSlice";

const EsewaButton = ({ amount, orderId }) => {
  const [initEsewa, { isLoading }] = useEsewaInitiateMutation();

  const handlePay = async () => {
    try {
      const data = await initEsewa({ amount, orderId }).unwrap();

      // Keep info for status check after redirect-back
      sessionStorage.setItem(
        "esewa_txn",
        JSON.stringify({
          orderId,
          total_amount: data.total_amount,
          transaction_uuid: data.transaction_uuid,
        })
      );

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payment_url;

      [
        "amount",
        "tax_amount",
        "total_amount",
        "transaction_uuid",
        "product_code",
        "product_service_charge",
        "product_delivery_charge",
        "success_url",
        "failure_url",
        "signed_field_names",
        "signature",
      ].forEach((k) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = data[k];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || err.message || "eSewa init failed");
    }
  };

  return (
    <button
      className="btn btn-success"
      onClick={handlePay}
      disabled={isLoading}
    >
      {isLoading ? "Starting eSewa..." : "Pay with eSewa (Demo)"}
    </button>
  );
};

export default EsewaButton;
