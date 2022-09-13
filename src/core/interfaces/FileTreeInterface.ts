import { Translation } from './TranslationInterface';
import { TreeNode } from './TreeNodeInterface';

export type FileTreeInterface = {
	tree: TreeNode | null;
	translations: Translation | null;
	activeFile: TreeNode | null;
};
