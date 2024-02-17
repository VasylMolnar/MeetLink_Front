import { apiSlice } from "../../app/api/apiSlice";
import { IUser } from "../../types/authTypes";
import { uint8ArrayToBase64 } from "../../utils/uint8ArrayToBase64";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getMyInfo: builder.query({
      query: (id: string) => `/user/${id}`,

      transformResponse: (response: IUser) => {
        // if (response?.avatar?.data) {
        //   const base64String = uint8ArrayToBase64(response.avatar.data.data);

        //   // Return data URL
        //   return {
        //     ...response,
        //     avatar: `data:image/png;base64,${base64String}`,
        //   };
        // }

        let avatar = "";
        let meetList = [];

        if (response?.avatar?.data) {
          avatar = `data:image/png;base64,${uint8ArrayToBase64(
            response.avatar.data.data
          )}`;
        }

        if (response?.meetList?.length) {
          meetList = response.meetList.map((item: any) => ({
            ...item,
            img: `data:image/png;base64,${uint8ArrayToBase64(
              item.img.data.data
            )}`,
          }));
        }

        if (response?.avatar?.data || response?.meetList?.length) {
          return {
            ...response,
            avatar,
            meetList,
          };
        }

        return response;
      },

      providesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "User", id: arg }];
      },
    }),

    updateUserInfo: builder.mutation({
      query: (credentials: IUser) => ({
        url: `/user/${credentials.id}`,
        method: "PUT",
        body: { ...credentials },
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => {
        return [{ type: "User", id: arg.id }];
      },
    }),

    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "DELETE",
        body: {},
      }),
    }),

    uploadImg: builder.mutation({
      query: ({ formData, id }: any) => ({
        url: `/user/${id}/uploads`,
        method: "POST",
        body: formData,
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => [
        { type: "User", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetMyInfoQuery,
  useUpdateUserInfoMutation,
  useDeleteUserMutation,
  useUploadImgMutation,
} = userApiSlice;

// let avatar = null;
//         let meetList = <any>[];

//         if (response?.avatar?.data) {
//           const base64String = uint8ArrayToBase64(response.avatar.data.data);

//           console.log("base64String", base64String);
//           avatar = `data:image/png;base64,${base64String}`;
//         }

//         if (response?.meetList?.length) {
//           meetList = response.meetList.map((item: any) => ({
//             ...item,
//             img: `data:image/png;base64,${uint8ArrayToBase64(item)}`,
//           }));
//         }

//         if (response?.avatar?.data || response?.meetList?.length) {
//           return {
//             ...response,
//             avatar,
//             meetList,
//           };
//         }
