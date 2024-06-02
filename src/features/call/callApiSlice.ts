import { apiSlice } from "../../app/api/apiSlice";

export const callApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    createCall: builder.mutation({
      query: (credentials: any) => ({
        url: "/user/call",
        method: "POST",
        body: { ...credentials },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "User", id: arg.id }];
      },
    }),

    deleteUserCall: builder.mutation({
      query: ({ callId, userId }: any) => ({
        url: `/user/call/${callId}`,
        method: "DELETE",
        body: { callId, userId },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "User", id: arg.id }];
      },
    }),
  }),
});

export const { useCreateCallMutation, useDeleteUserCallMutation } =
  callApiSlice;
