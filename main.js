const { app, BrowserWindow, shell, session, systemPreferences, desktopCapturer, dialog } = require('electron');

const TITLE = 'Microsoft Teams';
const URL_START = 'https://teams.microsoft.com';
const PARTITION = 'persist:teams';
const IN_APP = ['microsoft.com', 'microsoftonline.com', 'live.com', 'office.com', 'cloud.microsoft'];

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

let win;
let isQuitting = false;

const hostAllowed = (url) => {
  try {
    const h = new URL(url).hostname;
    return IN_APP.some((d) => h === d || h.endsWith('.' + d));
  } catch { return false; }
};

function createWindow() {
  const ses = session.fromPartition(PARTITION);

  ses.setPermissionRequestHandler((_wc, permission, cb) => {
    cb(['media', 'display-capture', 'notifications', 'fullscreen', 'clipboard-sanitized-write'].includes(permission));
  });

  ses.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen', 'window'],
        thumbnailSize: { width: 0, height: 0 },
      });
      const list = sources.slice(0, 10);
      const names = list.map((s) => s.name);
      const { response } = await dialog.showMessageBox(win, {
        type: 'question',
        message: 'Choose what to share',
        buttons: [...names, 'Cancel'],
        cancelId: names.length,
      });
      if (response === names.length) return callback({});
      callback({ video: list[response] });
    } catch (err) {
      console.error('Screen share failed:', err);
      callback({});
    }
  });

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: TITLE,
    webPreferences: { partition: PARTITION, contextIsolation: true },
  });

  win.webContents.setUserAgent(UA);
  win.loadURL(URL_START);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (hostAllowed(url)) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.on('close', (e) => {
    if (!isQuitting) { e.preventDefault(); win.hide(); }
  });

  win.webContents.on('page-title-updated', (_e, title) => {
    const m = title.match(/^\((\d+)\)/);
    app.dock.setBadge(m ? m[1] : '');
  });
}

app.whenReady().then(async () => {
  await systemPreferences.askForMediaAccess('microphone');
  await systemPreferences.askForMediaAccess('camera');
  createWindow();
});

app.on('activate', () => win && win.show());
app.on('before-quit', () => { isQuitting = true; });
