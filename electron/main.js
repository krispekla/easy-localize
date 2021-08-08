const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require("electron-devtools-installer");

const windowConfig = require("./config/windowConfig.js");

let mainWindow;
global.share = { ipcMain };

function createWindow(url) {
  mainWindow = new BrowserWindow({
    ...windowConfig["overview"],
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(url);
}

app.whenReady().then(async () => {
  createWindow("http://localhost:3000/overview");

  mainWindow.webContents.once("dom-ready", async () => {
    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension: ${name}`))
      .catch((err) => console.log("An error occurred: ", err))
      .finally(() => {
        require("electron-debug")();
        mainWindow.webContents.openDevTools({ mode: "detach" });
      });
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

require("./handlers/index.js");
