import { BrowserWindow } from 'electron';
import { ipcMain } from '../main';
import windowConfig from '../config/windowConfig';

function setWindow({ sender }: Electron.IpcMainEvent, config: { window: string, projectId: number }) {
    let browserWindow = BrowserWindow.fromWebContents(sender);
    const { width, height, maxWidth, maxHeight, minWidth, minHeight, animation, title } =
        windowConfig[config.window];

    browserWindow.setTitle(title);
    if (minWidth && minHeight) browserWindow.setMinimumSize(minWidth, minHeight);
    if (minWidth && minHeight) browserWindow.setMaximumSize(maxWidth, maxHeight);
    browserWindow.setSize(width, height, animation);
    browserWindow.center();

    sender.send('resize-window-return', `{ projectId: config.projectId, message: dosao je sa${config.projectId}, ${process.env.NODE_ENV}` );
}

export const windowOpenEditor = ipcMain.on('window-open-editor', setWindow)
