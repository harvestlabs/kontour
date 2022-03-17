import { EditorContractViewFragment } from "@gql/__generated__/EditorContractViewFragment";
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
  id: string;
  selectedContractData: EditorContractViewFragment | null;
  selectedVersionId: string;
  data: ProjectData;
  logs: any[];
}

const initialState: ProjectState = {
  id: "",
  selectedContractData: null,
  selectedVersionId: "",
  data: BLANK_PROJECT_DATA,
  logs: [],
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: (state, action: PayloadAction<any>) => {
      state.data = BLANK_PROJECT_DATA;
      state.id = "";
    },
    setId: (state, action: PayloadAction<any>) => {
      state.id = action.payload;
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
    setSelectedContractData: (state, action: PayloadAction<any>) => {
      state.selectedContractData = action.payload;
    },
    setSelectedVersionId: (state, action: PayloadAction<any>) => {
      state.selectedVersionId = action.payload;
    },
    appendLog: (state, action: PayloadAction<any>) => {
      state.logs.push(action.payload);
    },
  },
});

export const selectId = (state: RootState): string => state.project.id;
export const selectSelectedContractData = (state: RootState): any =>
  state.project.selectedContractData;
export const selectData = (state: RootState): ProjectData => state.project.data;
export const selectDatasources = (state: RootState): Datasources =>
  state.project.data.datasources || {};
export const selectDisplays = (state: RootState): Displays =>
  state.project.data.displays || {};
export const selectInteractions = (state: RootState): Interactions =>
  state.project.data.interactions || {};
export const selectPage = (state: RootState): Page =>
  state.project.data.page || { components: [] };
export const selectSelectedVersionId = (state: RootState): string =>
  state.project.selectedVersionId;
export const selectLogs = (state: RootState): any[] => state.project.logs;

export const {
  reset,
  setData,
  setId,
  mergeData,
  setSelectedContractData,
  setSelectedVersionId,
  appendLog,
} = projectSlice.actions;

export default projectSlice.reducer;
