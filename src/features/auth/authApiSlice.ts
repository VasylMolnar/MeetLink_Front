import { apiSlice } from "../../app/api/apiSlice";
import { IUser, IUserLogin } from "../../types/authTypes";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    registerUser: builder.mutation({
      query: (credentials: IUser) => ({
        url: "auth/",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    logInUser: builder.mutation({
      query: (credentials: IUserLogin) => ({
        url: "auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    logOutUser: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const {
  useLogInUserMutation,
  useRegisterUserMutation,
  useLogOutUserMutation,
} = authApiSlice;
