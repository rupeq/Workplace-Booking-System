import { createSlice } from "@reduxjs/toolkit";

export const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState: {
    value: localStorage.getItem("accessToken"),
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    removeAccessToken: (state) => {
      state.value = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setAccessToken, removeAccessToken } = accessTokenSlice.actions;

export const selectAccessToken = (state) => state.accessToken.value;

export default accessTokenSlice.reducer;
