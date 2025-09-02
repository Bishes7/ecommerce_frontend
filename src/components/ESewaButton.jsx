import React from "react";
import { useEsewaInitiateMutation } from "../slices/paymentApiSlice";
import { Message } from "./ui/Message";

const EsewaButton = ({ amount, orderId }) => {
  const [initEsewa, { isLoading, error }] = useEsewaInitiateMutation();

  const handlePay = async () => {
    try {
      const data = await initEsewa({ amount, orderId }).unwrap();

      // store txn info for later status check
      sessionStorage.setItem(
        "esewa_txn",
        JSON.stringify({
          orderId,
          total_amount: data.total_amount,
          transaction_uuid: data.transaction_uuid,
        })
      );

      // Use backend values exactly as returned
      const payload = {
        amount: String(data.total_amount),
        tax_amount: "0",
        total_amount: String(data.total_amount),
        transaction_uuid: data.transaction_uuid,
        product_code: data.product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: data.success_url,
        failure_url: data.failure_url,
        signed_field_names: data.signed_field_names,
        signature: data.signature,
      };

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payment_url;

      Object.entries(payload).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      console.log("FINAL FORM PAYLOAD", payload);
      form.submit();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || err.message || "eSewa init failed");
    }
  };

  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

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
