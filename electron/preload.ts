import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	send: (channel: any, args: any) => ipcRenderer.send(channel, args),
	on: (channel: any, callback: any) => ipcRenderer.on(channel, callback),
	removeAllListeners: (channel: any) => ipcRenderer.removeAllListeners(channel),
});
