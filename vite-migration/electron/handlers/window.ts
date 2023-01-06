import { BrowserWindow, screen } from 'electron';
import windowConfig from '../config/window';

function setWindow({ sender }: Electron.IpcMainEvent, config: { window: string; projectId: number }) {
  let browserWindow = BrowserWindow.fromWebContents(sender) as BrowserWindow;
  const { width, height, maxWidth, maxHeight, minWidth, minHeight, animation, title, maximum } =
    windowConfig[config.window];

  browserWindow.setTitle(title);
  browserWindow.setMinimumSize(minWidth, minHeight);

  if (maximum) {
    const winBounds = browserWindow.getBounds();
    const { width: machineScreenWidth, height: machineScreenHeight } = screen.getDisplayNearestPoint({
      x: winBounds.x,
      y: winBounds.y
    }).workAreaSize;
    browserWindow.setMaximumSize(machineScreenWidth, machineScreenHeight);
    browserWindow.setSize(machineScreenWidth, machineScreenHeight);
  } else {
    if (maxWidth && maxHeight) browserWindow.setMaximumSize(maxWidth, maxHeight);
    if (width && height) browserWindow.setSize(width, height, animation);
  }

  browserWindow.center();

  sender.send(
    'resize-window-return',
    `{ projectId: config.projectId, message: dosao je sa${config.projectId}, ${process.env.NODE_ENV}`
  );
}

export default [{ name: 'window-open-editor', handler: setWindow }];
