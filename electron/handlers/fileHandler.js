const { dialog } = require('electron');

async function loadDirectory(event, args) {
	const folderPathResult = await dialog.showOpenDialog({
		properties: ['openDirectory'],
	});

	event.sender.send(
		'directory-path',
		folderPathResult.canceled ? 'canceled' : folderPathResult.filePaths[0]
	);
}

module.exports = {
	fileHandler: global.share.ipcMain.on('load-directory', loadDirectory),
};
