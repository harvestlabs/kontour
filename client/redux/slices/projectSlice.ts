import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";

export interface ProjectState {
  data: any;
}

const initialState: ProjectState = {
  data: {},
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: (state, action: PayloadAction<any>) => {
      state.data = {};
    },
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    mergeData: (state, action: PayloadAction<any>) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
  },
});

export const selectData = (state: RootState) => state.project.data;
export const selectDatasources = (state: RootState) =>
  state.project.data?.datasources;
export const selectPage = (state: RootState) => state.project.data?.page;

export const { reset, setData, mergeData } = projectSlice.actions;

export default projectSlice.reducer;
