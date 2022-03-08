import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import projectReducer from "@redux/slices/projectSlice";
import userReducer from "@redux/slices/userSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
