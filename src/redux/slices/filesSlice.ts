import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import TranslationDialogEnum from '../../core/enums/TranslationDialogEnum';
import { FileTreeInterface } from '../../core/interfaces/FileTreeInterface';
import { Translation } from '../../core/interfaces/TranslationInterface';
import { TreeNode } from '../../core/interfaces/TreeNodeInterface';

const initialState: FileTreeInterface = {
	tree: null,
	fileTranslations: [],
	translations: null,
	translationData: [],
	activeFile: null,
	selectedTranslation: {},
	selectedFileTranslation: {},
	updatedIds: [],
	showEditDialog: false,
	translationDialogType: TranslationDialogEnum.add,
	exportCsv: false,
};

function readAllTranslationsFromTree(node: TreeNode, acumulator: {}): any {
	if (node.children.length > 0) {
		for (let i = 0; i < node.children.length; i++) {
			readAllTranslationsFromTree(node.children[i], acumulator);
		}
	} else {
		if (node.translations) {
			for (let i = 0; i < node.translations.length; i++) {
				const tx = node.translations[i] as unknown as Translation;
				const id = tx.name;
				if (acumulator.hasOwnProperty(id as unknown as PropertyKey)) {
					// @ts-ignore
					acumulator[id].push({ fileName: node.name, start: tx.start, end: tx.end });
				} else {
					// @ts-ignore
					acumulator[id] = [{ fileName: node.name, start: tx.start, end: tx.end }];
				}
			}
		}
		return acumulator;
	}
}

const electronSaveTranslations = (url: string, txs: Translation) => {
	if (window?.electron?.send) {
		window.electron.send('write-translation-files', { url, translations: txs });
	}
};

const filesSlice = createSlice({
	name: 'tree',
	initialState,
	reducers: {
		setFiles(state, action: PayloadAction<TreeNode>) {
			state.tree = action.payload;
		},
		setFileTranslations(state, action: PayloadAction<TreeNode>) {
			let translations: {} = {};
			readAllTranslationsFromTree(action.payload, translations);
			state.fileTranslations = translations;
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
		setSelectedFileTranslation(state, action: PayloadAction<{}>) {
			state.selectedFileTranslation = action.payload;
		},
		setShowEditDialog(state, action: PayloadAction<boolean>) {
			state.showEditDialog = action.payload;
		},
		setTranslationDialogType(state, action: PayloadAction<TranslationDialogEnum>) {
			state.translationDialogType = action.payload;
		},
		saveTranslations(state, action: PayloadAction<string>) {
			const translations = {};
			for (let i = 0; i < state.translationData.length; i++) {
				const tx = state.translationData[i] as Translation;
				let temp = {};
				let id = '';
				for (const [key, value] of Object.entries(tx)) {
					if (key === 'id') {
						id = value as unknown as string;
					} else {
						// @ts-ignore
						temp[key] = value;
					}
				}
				// @ts-ignore
				translations[id] = temp;
			}
			state.translations = translations;
			electronSaveTranslations(action.payload, translations);
		},
		resetTranslationData(state) {
			const filledTranslations = [];
			// @ts-ignore
			for (const [key, value] of Object.entries(state.translations)) {
				const temp: { [key: string]: String } = {
					id: key,
				};
				for (const [lng, translation] of Object.entries(value)) {
					// @ts-ignore
					temp[lng] = translation;
				}
				filledTranslations.push(temp);
			}
			state.translationData = filledTranslations;
		},
		deleteTranslation(state) {
			if (isEmpty(state.selectedTranslation)) return;
			const translationsWithRemoved = state.translationData.filter(
				// @ts-ignore
				(x) => x.id !== state.selectedTranslation.id
			);
			state.selectedTranslation = {};
			state.translationData = translationsWithRemoved;
		},
		setExportCsvFlag(state, action: PayloadAction<boolean>) {
			state.exportCsv = action.payload;
		},
	},
});

export const {
	setFiles,
	setFileTranslations,
	setActiveFile,
	setIsExpandedOnDirectoryNode,
	setTranslations,
	setTranslationData,
	setUpdatedIds,
	setSelectedTranslation,
	setSelectedFileTranslation,
	setShowEditDialog,
	setTranslationDialogType,
	deleteTranslation,
	setExportCsvFlag,
	saveTranslations,
	resetTranslationData,
} = filesSlice.actions;

export default filesSlice.reducer;
