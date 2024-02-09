import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { logOut, setCredentials } from "../../features/auth/authSlice";

export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  // credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const token = getState().auth.accessToken;

    //console.log("token",token);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-expect-error
  // if (result?.error?.originalStatus === 403) {
  //   const refreshToken = await baseQuery("/refresh", api, extraOptions);

  //   // if (refreshToken?.data) {
  //   //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //   api.dispatch(
  //   //     setCredentials({ accessToken: refreshToken.data.accessToken })
  //   //   );

  //   //   return await baseQuery(args, api, extraOptions);
  //   // } else {
  //   //   api.dispatch(logOut());
  //   // }
  // }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: () => ({}),
});
