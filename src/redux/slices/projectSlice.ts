import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectInterface {
  name: string;
  src: string;
  isPinned: boolean;
}

interface ProjectState {
  projects: Array<ProjectInterface>;
  value: number;
}

const initialState = {
  projects: [ 
     {
      name: 'Test projekt 1',
      src: '/user/app/test1',
      isPinned: false,
  },
  {
      name: 'Test projekt 2',
      src: '/user/app/test2',
      isPinned: false,
  },
  {
      name: 'Test projekt 3',
      src: '/user/app/test3',
      isPinned: true,
  } ],
  value: 4,
} as ProjectState;

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<ProjectInterface>) {
      state.projects.push(action.payload);
    },
    increment(state) {
      state.value++;
    },
    renameProject(state, action: PayloadAction<{index: number, newName: string}>) {
      state.projects[action.payload.index].name = action.payload.newName
    },
    changeProjectFolder(state, action: PayloadAction<{index: number, newSrc: string}>) {
      state.projects[action.payload.index].name = action.payload.newSrc
    },
    removeProject(state, action: PayloadAction<number>) {
      state.projects.splice(action.payload, 1);
    },
  },
});

export const { addProject, increment, removeProject } = projectSlice.actions;

export default projectSlice.reducer;
