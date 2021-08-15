import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	send: (channel: string, args: any[]) => ipcRenderer.send(channel, args),
	on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, callback),
	removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});
