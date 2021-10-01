import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import locationsReducer from "./slices/locationsSlice";
import postsReducer from "./slices/postsSlice";
import sessionReducer from "./slices/sessionSlice";
import categoriesSlice from "./slices/categoriesSlice";

export const store = configureStore({
  reducer: {
    locations: locationsReducer,
    posts: postsReducer,
    session: sessionReducer,
    categories: categoriesSlice,
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
