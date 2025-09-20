// src/slices/paymentApiSlice.js
import { apiSlice } from "./apiSlice";
import { PAYMENT_URL } from "../constants";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/khalti/initiate`,
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/khalti/verify`,
        method: "POST",
        body: data,
      }),
    }),

    esewaInitiate: builder.mutation({
      query: ({ amount, orderId }) => ({
        url: `${PAYMENT_URL}/esewa/initiate`,
        method: "POST",
        body: { amount, orderId },
      }),
    }),

    esewaStatus: builder.query({
      // pass { total_amount, transaction_uuid }
      query: ({ total_amount, transaction_uuid }) => ({
        url: `${PAYMENT_URL}/esewa/status`,
        params: { total_amount, transaction_uuid },
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useVerifyPaymentMutation,
  useEsewaInitiateMutation,
  useEsewaStatusQuery,
} = paymentApiSlice;
