import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";

export interface EthState {
  address: string;
}

const initialState: EthState = {
  address: "",
};

export const ethSlice = createSlice({
  name: "eth",
  initialState,
  reducers: {
    setAddressTo: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
  },
});

export const selectAddress = (state: RootState) => state.eth.address;

export const { setAddressTo } = ethSlice.actions;

export default ethSlice.reducer;
