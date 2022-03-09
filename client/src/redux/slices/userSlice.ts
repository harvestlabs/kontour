import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";

export interface UserState {
  user_id: string;
  twitter_handle: string;
  twitter_image: string;
}

const initialState: UserState = {
  user_id: "",
  twitter_handle: "",
  twitter_image: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state, action: PayloadAction) => {
      state.user_id = "";
      state.twitter_handle = "";
    },
    setUserIdTo: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    setTwitterHandleTo: (state, action: PayloadAction<string>) => {
      state.twitter_handle = action.payload;
    },
    setTwitterImageTo: (state, action: PayloadAction<string>) => {
      state.twitter_image = action.payload;
    },
  },
});

export const selectUserId = (state: RootState) => state.user.user_id;
export const selectTwitterHandle = (state: RootState) =>
  state.user.twitter_handle;
export const selectTwitterImage = (state: RootState) =>
  state.user.twitter_image;

export const { resetUser, setUserIdTo, setTwitterHandleTo, setTwitterImageTo } =
  userSlice.actions;

export default userSlice.reducer;
