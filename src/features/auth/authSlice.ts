import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      return { ...state, ...action.payload };
    },

    logOut: (state) => {
      state.id = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

//select
export const selectCurrentUserId = (state: any) => state.auth.id;
export const selectCurrentToken = (state: any) => state.auth.accessToken;
