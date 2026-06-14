const { app, BrowserWindow, shell } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const APP_TITLE = "Виртуальная экскурсия";

function getDistIndexPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "dist", "index.html");
  }

  return path.join(__dirname, "..", "dist", "index.html");
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 680,
    title: APP_TITLE,
    backgroundColor: "#2E2116",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (DEV_SERVER_URL) {
    mainWindow.loadURL(DEV_SERVER_URL);
    return;
  }

  const indexPath = getDistIndexPath();

  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
    return;
  }

  mainWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
      <html lang="ru">
        <head>
          <title>${APP_TITLE}</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: #2e2116;
              color: #f6e6c5;
              font-family: Georgia, serif;
            }
            main {
              max-width: 640px;
              padding: 32px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <main>
            <h1>${APP_TITLE}</h1>
            <p>Сборка сайта не найдена. Запустите npm run build перед упаковкой приложения.</p>
          </main>
        </body>
      </html>
    `)}`,
  );
}

app.whenReady().then(() => {
  app.setName(APP_TITLE);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
