import { Project } from './ProjectInterface';

export interface Settings {
  projects: Project[];
  currentProject: number;
  googleApiKey: string;
}
