import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Datasources,
  Displays,
  Interactions,
  Page,
  ProjectData,
} from "types/project";
import { RootState, AppThunk } from "../store";

const BLANK_PROJECT_DATA = {
  datasources: {},
  displays: {},
  interactions: {},
  page: { components: [] },
};
export interface ProjectState {
  data: ProjectData;
}

const initialState: ProjectState = {
  data: BLANK_PROJECT_DATA,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: (state, action: PayloadAction<any>) => {
      state.data = BLANK_PROJECT_DATA;
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

export const selectData = (state: RootState): ProjectData => state.project.data;
export const selectDatasources = (state: RootState): Datasources =>
  state.project.data.datasources || {};
export const selectDisplays = (state: RootState): Displays =>
  state.project.data.displays || {};
export const selectInteractions = (state: RootState): Interactions =>
  state.project.data.interactions || {};
export const selectPage = (state: RootState): Page =>
  state.project.data.page || { components: [] };

export const { reset, setData, mergeData } = projectSlice.actions;

export default projectSlice.reducer;
