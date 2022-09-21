import { DataTable } from 'primereact/datatable';
import { MutableRefObject } from 'react';
import TranslationDialogEnum from '../enums/TranslationDialogEnum';
import { Translation } from './TranslationInterface';
import { TreeNode } from './TreeNodeInterface';

export type FileTreeInterface = {
	tree: TreeNode | null;
	translations: Translation | null;
	activeFile: TreeNode | null;
	translationData: any[];
	updatedIds: any[];
	selectedTranslation: {};
	showEditDialog: boolean;
	translationDialogType: TranslationDialogEnum;
	exportCsv: boolean;
};
