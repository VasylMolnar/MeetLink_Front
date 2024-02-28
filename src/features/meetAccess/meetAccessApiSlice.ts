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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, _arg: any) => {
        return [{ type: "User" }];
      },
    }),

    //delete  message
    deleteAccessMessage: builder.mutation({
      query: ({ userId, messageId }: any) => ({
        url: "/meet-access/access-delete",
        method: "DELETE",
        body: { userId, messageId },
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, _arg: any) => {
        return [{ type: "User" }];
      },
    }),
  }),
});

export const {
  useReqAccessMutation,
  useResAccessMutation,
  useDeleteAccessMessageMutation,
} = meetAccessApiSlice;
