import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../core/interfaces/ProjectInterface';
import { Settings } from '../../core/interfaces/SettingsInterface';
import {cloneDeep} from 'lodash'
const initialState: Settings = {
    projects: [
    ],
};

const updateElectronConfig = (state: Settings) => {
    if (window?.electron?.send) {
        window.electron.send('settings-save', cloneDeep(state));
    }
}

const settingsSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        addProject(state, action: PayloadAction<Project>) {
            state.projects.push(action.payload);
            updateElectronConfig(state)
        },
        renameProject(state, action: PayloadAction<{ index: number; newName: string }>) {
            state.projects[action.payload.index].name = action.payload.newName;
            updateElectronConfig(state)
        },
        changeProjectFolder(state, action: PayloadAction<{ index: number; newSrc: string }>) {
            state.projects[action.payload.index].src = action.payload.newSrc;
            updateElectronConfig(state)
        },
        removeProject(state, action: PayloadAction<number>) {
            state.projects.splice(action.payload, 1);
            updateElectronConfig(state)
        },
        loadSettings(state, action: PayloadAction<Settings>) {
            state.projects = action.payload.projects;
        },
    },
});

export const { addProject, renameProject, changeProjectFolder, removeProject, loadSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
