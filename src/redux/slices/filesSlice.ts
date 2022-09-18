import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TranslationDialogEnum from '../../core/enums/TranslationDialogEnum';
import { FileTreeInterface } from '../../core/interfaces/FileTreeInterface';
import { Translation } from '../../core/interfaces/TranslationInterface';
import { TreeNode } from '../../core/interfaces/TreeNodeInterface';

const initialState: FileTreeInterface = {
	tree: null,
	translations: null,
	translationData: [],
	activeFile: null,
	selectedTranslation: {},
	updatedIds: [],
	showEditDialog: false,
	translationDialogType: TranslationDialogEnum.add,
};

const filesSlice = createSlice({
	name: 'tree',
	initialState,
	reducers: {
		setFiles(state, action: PayloadAction<TreeNode>) {
			state.tree = action.payload;
		},
		setActiveFile(state, action: PayloadAction<TreeNode>) {
			state.activeFile = action.payload;
		},
		setIsExpandedOnDirectoryNode(state, action: PayloadAction<TreeNode>) {
			const findAndModifyFileTreeNode = (originalNodes: TreeNode[], node: TreeNode) => {
				const foundNode = originalNodes.find((x: TreeNode) => x.name === node.name);
				if (foundNode) {
					foundNode.isExpanded = !foundNode.isExpanded;
					return;
				}

				originalNodes.forEach((x) => {
					findAndModifyFileTreeNode(x.children, node);
				});
			};

			if (state.tree) findAndModifyFileTreeNode(state.tree.children, action.payload);
		},
		setTranslations(state, action: PayloadAction<Translation>) {
			state.translations = action.payload;
		},
		setTranslationData(state, action: PayloadAction<any[]>) {
			state.translationData = action.payload;
		},
		setUpdatedIds(state, action: PayloadAction<any[]>) {
			state.updatedIds = action.payload;
		},
		setSelectedTranslation(state, action: PayloadAction<{}>) {
			state.selectedTranslation = action.payload;
		},
		setShowEditDialog(state, action: PayloadAction<boolean>) {
			state.showEditDialog = action.payload;
		},
		setTranslationDialogType(state, action: PayloadAction<TranslationDialogEnum>) {
			state.translationDialogType = action.payload;
		},
	},
});

export const {
	setFiles,
	setActiveFile,
	setIsExpandedOnDirectoryNode,
	setTranslations,
	setTranslationData,
	setUpdatedIds,
	setSelectedTranslation,
	setShowEditDialog,
	setTranslationDialogType,
} = filesSlice.actions;

export default filesSlice.reducer;
