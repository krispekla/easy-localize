import { dialog }  from 'electron';
import {ipcMain}  from '../main';

async function loadDirectory(event: { sender: { send: (arg0: string, arg1: any) => void; }; }, args: any) {
	const folderPathResult = await dialog.showOpenDialog({
		properties: ['openDirectory'],
	});

	event.sender.send(
		'directory-path',
		folderPathResult.canceled ? 'canceled' : folderPathResult.filePaths[0]
	);
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const fileHandler = ipcMain.on('load-directory', loadDirectory)

export default fileHandler