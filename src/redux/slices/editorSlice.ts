import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorInterface = {
	translationData: any[];
	updatedIds: any[];
	selectedTranslation: {};
	languages: any[];
};

const initialState: EditorInterface = {
	translationData: [],
	updatedIds: [],
	selectedTranslation: {},
	languages: [],
};

const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		setFiles(state, action: PayloadAction<any>) {
			// state.tree = action.payload;
		},
		setActiveFile(state, action: PayloadAction<any>) {
			// state.activeFile = action.payload;
		},
	},
});

export const { setFiles, setActiveFile } = editorSlice.actions;

export default editorSlice.reducer;
