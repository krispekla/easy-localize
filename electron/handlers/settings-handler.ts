import { dialog } from 'electron';
import { readAppSettings, writeAppSettings } from '../util/file-helper';
import { ipcMain } from '../main';

function loadSettings(event: Electron.IpcMainEvent, args: any[]) {
    const appData = readAppSettings()
    event.sender.send('settings-load-return', appData);
}


async function directoryDialog(event: Electron.IpcMainEvent, args: any[]) {
    const folderPathResult = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });

    event.sender.send(
        'directory-dialog-return',
        folderPathResult.canceled ? 'canceled' : { source: folderPathResult.filePaths[0], type: args }
    );
}

export const writeSettingsListener = ipcMain.on('settings-save', writeAppSettings)
export const readSettingsListener = ipcMain.on('settings-load', loadSettings)
export const fileHandler = ipcMain.on('directory-dialog', directoryDialog)
