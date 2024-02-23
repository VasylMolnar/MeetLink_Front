import { apiSlice } from "../../app/api/apiSlice";

export const meetAccessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //send req to Admin
    reqAccess: builder.mutation({
      query: ({ meetId, userId }: any) => ({
        url: "/meet-access/access-req",
        method: "POST",
        body: { meetId, userId },
      }),
    }),

    //send res from Admin
    resAccess: builder.mutation({
      query: ({ meetId, userId, messageId, access }: any) => ({
        url: "/meet-access/access-res",
        method: "POST",
        body: { meetId, userId, messageId, access },
      }),
    }),
  }),
});

export const { useReqAccessMutation, useResAccessMutation } =
  meetAccessApiSlice;

//add api to delete message
