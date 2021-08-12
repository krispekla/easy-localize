const windowConfig = require('../config/windowConfig.js');
const { BrowserWindow } = require('electron');

function setWindow(sender, config) {
	let browserWindow = BrowserWindow.fromWebContents(sender);
	const { width, height, maxWidth, maxHeight, minWidth, minHeight, animation, title } =
		windowConfig[config];

	browserWindow.setTitle(title);
	if (minWidth && minHeight) browserWindow.setMinimumSize(minWidth, minHeight);
	if (minWidth && minHeight) browserWindow.setMaximumSize(maxWidth, maxHeight);
	browserWindow.setSize(width, height, animation);
	browserWindow.center();

	browserWindow.loadURL(`http://localhost:3000/${config}`);
	sender.send('resize-window-return', `dosao je sa${config}`);
}

function openEditor(event, args) {
	setWindow(event.sender, args);
}

module.exports = {
	openEditor: global.share.ipcMain.on('window-open-editor', openEditor),
};
