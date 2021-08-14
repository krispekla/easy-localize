import windowConfig from '../config/windowConfig';
import { BrowserWindow } from 'electron';
import { ipcMain } from '../main';

function setWindow({ sender }: Electron.IpcMainEvent, config: string | number) {
    let browserWindow = BrowserWindow.fromWebContents(sender);
    const { width, height, maxWidth, maxHeight, minWidth, minHeight, animation, title } =
        windowConfig[config];

    browserWindow.setTitle(title);
    if (minWidth && minHeight) browserWindow.setMinimumSize(minWidth, minHeight);
    if (minWidth && minHeight) browserWindow.setMaximumSize(maxWidth, maxHeight);
    browserWindow.setSize(width, height, animation);
    browserWindow.center();

    sender.send('resize-window-return', `dosao je sa${config}, ${process.env.NODE_ENV}`);
}

export const windowOpenEditor = ipcMain.on('window-open-editor', setWindow)
