import { IpcMain } from 'electron';
import windowHandlers from './window';
import translationHandlers from './translations';
import settingsHandlers from './settings';
import fileHandlers from './files';

export function registerListeners(app: IpcMain): void {
  const combinedHandlers = [...windowHandlers, ...translationHandlers, ...settingsHandlers, ...fileHandlers];
  for (let i = 0; i < combinedHandlers.length; i++) {
    app.on(combinedHandlers[i].name, combinedHandlers[i].handler);
  }
}
