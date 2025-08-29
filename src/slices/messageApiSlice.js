import { MESSAGE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (data) => ({
        url: MESSAGE_URL,
        method: "POST",
        body: data,
      }),
    }),

    getMessage: builder.query({
      query: () => ({
        url: MESSAGE_URL,
        method: "GET",
      }),
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `${MESSAGE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetMessageQuery,
  useDeleteMessageMutation,
} = messageApiSlice;
