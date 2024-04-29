import { apiSlice } from "../../app/api/apiSlice";

export const followAccessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //send req to User
    reqAccessFollow: builder.mutation({
      query: ({ followUserId, userId }: any) => ({
        url: "/access/follow-access-req",
        method: "POST",
        body: { followUserId, userId },
      }),
    }),

    //send res from User
    resAccessFollow: builder.mutation({
      query: ({ followUserId, userId, messageId, access }: any) => ({
        url: "/access/follow-access-res",
        method: "POST",
        body: { followUserId, userId, messageId, access },
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, _arg: any) => {
        return [{ type: "User" }];
      },
    }),

    //delete user follow
    deleteFollow: builder.mutation({
      query: ({ followUserId, userId }: any) => ({
        url: "/access/delete-follow-user",
        method: "DELETE",
        body: { followUserId, userId },
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, _arg: any) => {
        return [{ type: "User" }];
      },
    }),
  }),
});

export const {
  useReqAccessFollowMutation,
  useResAccessFollowMutation,
  useDeleteFollowMutation,
} = followAccessApiSlice;
