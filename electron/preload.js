const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, args) => ipcRenderer.send(channel, args),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
});
