import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import settingsReducer from './slices/settingsSlice';
import fileTreeReducer from './slices/filesSlice';

const store = configureStore({
	reducer: {
		editor: editorReducer,
		settings: settingsReducer,
		files: fileTreeReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
