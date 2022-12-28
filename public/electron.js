const electron = require("electron");
const { ipcMain, app, dialog } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const options = {
    icon: path.join(__dirname, "./favicon.ico"),
    modal: false,
    autoHideMenuBar: true,
    backgroundColor: "#444",
    title: "File Manager",
    webPreferences: {
      nativeWindowOpen: true,
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
    },
  };
  let mainWindow = new BrowserWindow(options);
  mainWindow.webContents.on("before-input-event", (e, input) => {
    if (input.type === "keyDown" && input.key === "F12" && isDev) {
      mainWindow.webContents.toggleDevTools();
    }
  });
  mainWindow.maximize();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : path.join(__dirname, "../build/index.html")
  );

  ipcMain.on("archive", (event, data) => {
    dialog
      .showOpenDialog({
        properties: ["openDirectory"],
        filters: [{ name: "Select a Destination:" }],
      })
      .then((result) => {
        event.reply(data, result.filePaths[0]);
      });
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
