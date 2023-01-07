import { dialog } from 'electron';
import { readAppSettings, writeAppSettings } from '../util/file-helper';

function loadSettings(event: Electron.IpcMainEvent, _args: any[]) {
  const appData = readAppSettings();
  event.sender.send('settings-load-return', appData);
}

async function directoryDialog(event: Electron.IpcMainEvent, args: any[]) {
  const folderPathResult = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  event.sender.send(
    'directory-dialog-return',
    folderPathResult.canceled ? 'canceled' : { source: folderPathResult.filePaths[0], type: args }
  );
}

export default [
  { name: 'settings-save', handler: writeAppSettings },
  { name: 'settings-load', handler: loadSettings },
  { name: 'directory-dialog', handler: directoryDialog }
];
