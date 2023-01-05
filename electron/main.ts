import windowConfig from './config/windowConfig';

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: BrowserWindow | null;

export { ipcMain, app };
const isDevelopment = process.env.NODE_ENV === 'development';

async function createWindow() {
	mainWindow = new BrowserWindow({
		...windowConfig['overview'],
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	if (isDevelopment) {
		mainWindow.loadURL('http://localhost:3000#/overview');
	} else {
		mainWindow.loadURL(
			url.format({
				pathname: path.join(__dirname, '../index.html'),
				protocol: 'file:',
				slashes: true,
			})
		);
	}
}

app.whenReady().then(async () => {
	// Disabling manual reload
	// globalShortcut.register("CommandOrControl+R", () => { });
	await createWindow();

	if (isDevelopment) {
		import('electron-devtools-installer').then(async (extensions) => {
			const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, default: installExtension } = extensions;

			await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
				.then((name: any) => console.log(`Added Extension: ${name}`))
				.catch((err: any) => console.log('An error occurred: ', err))
				.finally(() => {
					mainWindow.webContents.openDevTools({ mode: 'detach' });
				});
		});
	}
});

app.on('window-all-closed', function () {
	// if (process.platform !== 'darwin') app.quit();
	app.quit();
});

require('./handlers/index');
