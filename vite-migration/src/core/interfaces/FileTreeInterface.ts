import TranslationDialogEnum from '../enums/TranslationDialogEnum';
import { Translation } from './TranslationInterface';
import { TreeNode } from './TreeNodeInterface';

export type FileTreeInterface = {
	tree: TreeNode | null;
	fileTranslations: object;
	translations: Translation | null;
	activeFile: TreeNode | null;
	translationData: any[];
	updatedIds: any[];
	selectedTranslation: Translation;
	selectedFileTranslation: Translation;
	showEditDialog: boolean;
	translationDialogType: TranslationDialogEnum;
	exportCsv: boolean;
};
