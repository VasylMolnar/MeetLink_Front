import { apiSlice } from "../../app/api/apiSlice";
import { IMeetInfo } from "../../types/authTypes";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";

export const meetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    createMeet: builder.mutation({
      query: ({ formData }: any) => ({
        url: "/meet/",
        method: "POST",
        body: formData,
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, _arg: any) => {
        // console.log(_result, arg);
        return [{ type: "User" }];
      },
    }),

    getCurrentMeet: builder.query({
      query: (id: string) => `/meet/${id}`,

      // transformResponse: (response: IMeetInfo) => {
      //   if (response?.img?.data) {
      //     const base64String = uint8ArrayToBase64(response.img.data.data);

      //     // Return data URL
      //     return {
      //       ...response,
      //       img: `data:image/png;base64,${base64String}`,
      //     };
      //   }

      //   return response;
      // },

      transformResponse: (response: IMeetInfo) => {
        let img = "";
        let userList = [];

        if (response?.img?.data) {
          img = `data:image/png;base64,${uint8ArrayToBase64(
            response.img.data.data
          )}`;
        }

        if (response?.userList?.length) {
          userList = response.userList.map((item: any) => ({
            ...item,
            avatar: `data:image/png;base64,${uint8ArrayToBase64(
              item.avatar.data.data
            )}`,
          }));
        }

        if (response?.img?.data || response?.userList?.length) {
          return {
            ...response,
            img,
            userList,
          };
        }

        return response;
      },

      providesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "Meet", id: arg }];
      },
    }),

    updateMeetInfo: builder.mutation({
      query: (credentials: IMeetInfo) => ({
        url: `/meet/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "Meet", id: arg.id }, { type: "User" }];
      },
    }),

    deleteMeet: builder.mutation({
      query: (id: string) => ({
        url: `/meet/${id}`,
        method: "DELETE",
        body: {},
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, _arg: any) => [
        { type: "User" },
      ],
    }),

    leaveMeet: builder.mutation({
      query: ({ meetId, userId }: any) => ({
        url: `/meet/${meetId}/${userId}`,
        method: "DELETE",
        body: {},
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "Meet", id: arg.id }, { type: "User" }];
      },
    }),

    uploadMeetImg: builder.mutation({
      query: ({ formData, id }: any) => ({
        url: `/meet/${id}/uploads`,
        method: "POST",
        body: formData,
      }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "Meet", id: arg.id }, { type: "User" }];
      },
    }),
  }),
});

export const {
  useGetCurrentMeetQuery,
  useCreateMeetMutation,
  useUpdateMeetInfoMutation,
  useDeleteMeetMutation,
  useUploadMeetImgMutation,
  useLeaveMeetMutation,
} = meetApiSlice;
