import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectSlice";

const store = configureStore({
  reducer: {
    overview: projectReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
