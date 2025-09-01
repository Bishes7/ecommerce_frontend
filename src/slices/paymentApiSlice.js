// src/slices/paymentApiSlice.js
import { apiSlice } from "./apiSlice";
import { PAYMENT_URL } from "../constants";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/khalti`,
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
  }),
});

export const { useCreatePaymentIntentMutation, useVerifyPaymentMutation } =
  paymentApiSlice;
