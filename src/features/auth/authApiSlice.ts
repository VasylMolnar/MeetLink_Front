import { apiSlice } from "../../app/api/apiSlice";
import { IUser, IUserLogin } from "../../types/authTypes";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    register: builder.mutation({
      query: (credentials: IUser) => ({
        url: "auth/",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    logIn: builder.mutation({
      query: (credentials: IUserLogin) => ({
        url: "auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    logOut: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { useLogInMutation, useRegisterMutation, useLogOutMutation } =
  authApiSlice;
