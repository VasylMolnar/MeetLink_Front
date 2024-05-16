import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  accessToken: null,
  publicRoomId: null,
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
      state.username = null;
      state.accessToken = null;
      state.publicRoomId = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

//select
export const selectCurrentUserId = (state: any) => state.auth.id;
export const selectCurrentUserName = (state: any) => state.auth.userName;
export const selectCurrentToken = (state: any) => state.auth.accessToken;
export const selectCurrentPublicRoomId = (state: any) =>
  state.auth.publicRoomId;
