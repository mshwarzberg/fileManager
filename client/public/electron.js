const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: "../src/Assets/images/folder.ico",
    modal: false,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
    },
  });
  mainWindow.webContents.on("before-input-event", (e, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      mainWindow.webContents.toggleDevTools();

      mainWindow.webContents.on("devtools-opened", () => {
        // Can't use mainWindow.webContents.devToolsWebContents.on("before-input-event") - it just doesn't intercept any events.
        mainWindow.webContents.devToolsWebContents
          .executeJavaScript(
            `
            new Promise((resolve)=> {
              addEventListener("keydown", (event) => {
                if (event.key === "F12") {
                  resolve();
                }
              }, { once: true });
            })
          `
          )
          .then(() => {
            mainWindow.webContents.toggleDevTools();
          });
      });
    }
  });
  mainWindow.maximize();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
