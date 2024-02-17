import { apiSlice } from "../../app/api/apiSlice";
import { IMeetInfo } from "../../types/authTypes";

export const meetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    createMeet: builder.mutation({
      query: ({ formData }: any) => ({
        url: "/meet/",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        console.log(_result, arg);
        return [{ type: "Meets", id: arg.id }];
      },
    }),

    updateMeetInfo: builder.mutation({
      query: (credentials: IMeetInfo) => ({
        url: `/meet/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "Meets", id: arg.id }];
      },
    }),

    deleteMeet: builder.mutation({
      query: (id: string) => ({
        url: `/meet/${id}`,
        method: "DELETE",
        body: {},
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "Meets", id: arg.id }];
      },
    }),

    uploadImg: builder.mutation({
      query: ({ formData, id }: any) => ({
        url: `/meet/${id}/uploads`,
        method: "POST",
        body: formData,
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => [
        { type: "Meets", id: arg.id },
      ],
    }),
  }),
});

export const {
  useCreateMeetMutation,
  useUpdateMeetInfoMutation,
  useDeleteMeetMutation,
  useUploadImgMutation,
} = meetApiSlice;
