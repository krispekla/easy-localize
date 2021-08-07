const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
global.share = {ipcMain}

function createWindow(url) {
  const win = new BrowserWindow({
    minWidth:800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // nodeIntegration: true,
      // enableRemoteModule:true,
      // contextIsolation: true
    },
  });

  win.loadURL(url);

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow("http://localhost:3000");
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});


require('./handlers/index.js')
