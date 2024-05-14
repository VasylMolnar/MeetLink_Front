import { apiSlice } from "../../app/api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    createMessage: builder.mutation({
      query: (credentials: any) => ({
        url: "/user/messages",
        method: "POST",
        body: { ...credentials },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "User", id: arg.id }];
      },
    }),

    deleteUserMessage: builder.mutation({
      query: ({ messageId, userId }: any) => ({
        url: `/user/messages/${messageId}`,
        method: "DELETE",
        body: { messageId, userId },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "User", id: arg.id }];
      },
    }),
  }),
});

export const { useCreateMessageMutation, useDeleteUserMessageMutation } =
  chatApiSlice;
