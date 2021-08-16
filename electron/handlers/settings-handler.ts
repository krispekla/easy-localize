import { dialog } from 'electron';
import { readAppSettings, writeAppSettings } from '../util/file-helper';
import { ipcMain } from '../main';

export interface ProjectInterface {
    name: string;
    src: string;
    isPinned: boolean;
}

export interface Settings {
    projects: ProjectInterface[]
}

function loadSettings(event: Electron.IpcMainEvent, args: any[]) {
    const appData = readAppSettings()
    event.sender.send('settings-load-return', appData);
}


async function loadDirectory(event: Electron.IpcMainEvent, args: any[]) {
    const folderPathResult = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });

    event.sender.send(
        'directory-path',
        folderPathResult.canceled ? 'canceled' : folderPathResult.filePaths[0]
    );
}

export const writeSettingsListener = ipcMain.on('settings-save', writeAppSettings)
export const readSettingsListener = ipcMain.on('settings-load', loadSettings)
export const fileHandler = ipcMain.on('directory-load', loadDirectory)
