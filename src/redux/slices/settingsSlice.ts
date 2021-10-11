import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../core/interfaces/ProjectInterface';
import { Settings } from '../../core/interfaces/SettingsInterface';
import { cloneDeep } from 'lodash'
const initialState: Settings = {
    projects: [
    ],
    currentProject: -1,
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
            state.projects.sort((a, b) => a.isPinned ? -1 : 1);
            updateElectronConfig(state)
        },
        updateProject(state, action: PayloadAction<{ project: Project, index: number }>) {
            state.projects[action.payload.index] = action.payload.project
            updateElectronConfig(state)
        },
        renameProject(state, action: PayloadAction<{ index: number; newName: string }>) {
            state.projects[action.payload.index].name = action.payload.newName;
            updateElectronConfig(state)
        },
        toggleProjectPin(state, action: PayloadAction<number>) {
            state.projects[action.payload].isPinned = !state.projects[action.payload].isPinned;
            state.projects.sort((a, b) => a.isPinned ? -1 : 1);
            updateElectronConfig(state)
        },
        changeProjectFolder(state, action: PayloadAction<{ index: number; newSrc: string }>) {
            state.projects[action.payload.index].src = action.payload.newSrc;
            updateElectronConfig(state)
        },
        removeProject(state, action: PayloadAction<Project>) {
            state.projects = state.projects.filter(x => x.name !== action.payload.name);
            updateElectronConfig(state)
        },
        loadSettings(state, action: PayloadAction<Settings>) {
            state.projects = action.payload.projects;
        },
        setCurrentProject(state, action: PayloadAction<number>) {
            state.currentProject = action.payload;
            updateElectronConfig(state)
        }
    },
});

export const { addProject, renameProject, changeProjectFolder, removeProject, updateProject, loadSettings, toggleProjectPin, setCurrentProject } = settingsSlice.actions;

export default settingsSlice.reducer;
