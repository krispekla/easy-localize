import { Translation } from './../util/file-helper';
import { readFileContent, readDirectoryTree, readTranslations } from '../util/file-helper';
import { ipcMain } from '../main';
import TreeNode from '../types/interfaces/TreeNode';

function readDirectoryTreeHandler(
	event: Electron.IpcMainEvent,
	{ path, ignoredDirectory }: { path: string; ignoredDirectory: string[] }
) {
	const loadedDirectoryTree: TreeNode = readDirectoryTree(path, ignoredDirectory);
	event.sender.send('read-directory-tree-return', loadedDirectoryTree);
}

function readFileHandler(event: Electron.IpcMainEvent, { path }: { path: string }) {
	const loadedFile = readFileContent(path);
	event.sender.send('read-file-return', loadedFile);
}

function readTranslationsHandler(
	event: Electron.IpcMainEvent,
	{ path, defaultLanguage }: { path: string; defaultLanguage: string }
) {
	const translations: Translation = readTranslations(path);
	event.sender.send('read-translation-files-return', translations);
}

export const readDirectoryTreeListener = ipcMain.on(
	'read-directory-tree',
	readDirectoryTreeHandler
);
export const readFileContentListener = ipcMain.on('read-file', readFileHandler);
export const readTranslationsListener = ipcMain.on(
	'read-translation-files',
	readTranslationsHandler
);
