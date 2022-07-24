import ProjectType from "../enums/ProjectType";
import { Language } from "./LanguageInterface";

export type Project = {
    name: string;
    src: string;
    isPinned: boolean;
    translationFolder?: string;
    projectType?: ProjectType | string;
    languages: Language[];
    defaultLanguage?: Language | null;
    excludedFolders?: string[];
}