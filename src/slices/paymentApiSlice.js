import { PAYMENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/khalti`,
        method: "POST",
        body: data,
      }),
    }),

    // verify payment
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/verify`,
        method: "POST",
        body: data,
      }),
    }),

    // get payment details
    getPaymentDetails: builder.query({
      query: (paymentId) => ({
        url: `${PAYMENT_URL}/${paymentId}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useGetPaymentDetailsQuery,
  useVerifyPaymentMutation,
} = paymentApiSlice;
