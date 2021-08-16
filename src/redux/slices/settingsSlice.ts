import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../core/interfaces/ProjectInterface';
import { Settings } from '../../core/interfaces/SettingsInterface';

const initialState: Settings = {
    projects: [
    ],
};

const settingsSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        addProject(state, action: PayloadAction<Project>) {
            state.projects.push(action.payload);
        },
        renameProject(state, action: PayloadAction<{ index: number; newName: string }>) {
            state.projects[action.payload.index].name = action.payload.newName;
        },
        changeProjectFolder(state, action: PayloadAction<{ index: number; newSrc: string }>) {
            state.projects[action.payload.index].src = action.payload.newSrc;
        },
        removeProject(state, action: PayloadAction<number>) {
            state.projects.splice(action.payload, 1);
        },
        loadSettings(state, action: PayloadAction<Settings>) {
            state.projects = action.payload.projects;
        },
    },
});

export const { addProject, renameProject, changeProjectFolder, removeProject, loadSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
