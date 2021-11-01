import { readFileContent, readDirectoryTree } from '../util/file-helper';
import { ipcMain } from '../main';
import TreeNode from '../types/interfaces/TreeNode';

function readDirectoryTreeHandler(event: Electron.IpcMainEvent, { path, ignoredDirectory }: { path: string, ignoredDirectory: string[] }) {
    console.log("%c 🚎: readDirectoryTreeHandler -> path, ignoredDirectory ", "font-size:16px;background-color:#e1d35b;color:black;", path, ignoredDirectory)
    const appData: TreeNode = readDirectoryTree(path, ignoredDirectory)
    console.log("%c 🇹🇬: readDirectoryTreeHandler -> appData ", "font-size:16px;background-color:#19f241;color:black;", appData)
    event.sender.send('read-directory-tree-return', appData);
}

function readFileContentHandler(event: Electron.IpcMainEvent, { path }: { path: string }) {
    const appData = readFileContent(path)
    event.sender.send('settings-load-return', appData);
}

export const readDirectoryTreeListener = ipcMain.on('read-directory-tree', readDirectoryTreeHandler)
export const readFileContentListener = ipcMain.on('read-file-content', readFileContentHandler)
