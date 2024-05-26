import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {},
  reducers: {
    addUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { addUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
