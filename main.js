const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs/promises");

const DATA_FILE_NAME = "teams.json";
const DEFAULT_DATA_PATH = path.join(__dirname, "data", "teams.default.json");
const DATA_FILE_FILTERS = [{ name: "JSON", extensions: ["json"] }];
const APP_TITLE = "パワプロ チームマネージャ";

let currentDataPath = null;

function formatWindowTitle(dataPath) {
  if (!dataPath) {
    return APP_TITLE;
  }
  return `${APP_TITLE} - ${path.basename(dataPath)}`;
}

function updateWindowTitle(browserWindow) {
  if (!browserWindow || browserWindow.isDestroyed()) {
    return;
  }
  browserWindow.setTitle(formatWindowTitle(currentDataPath));
}

async function ensureDataFile() {
  const dataDir = app.getPath("userData");
  const dataPath = path.join(dataDir, DATA_FILE_NAME);

  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    const defaultContent = await fs.readFile(DEFAULT_DATA_PATH, "utf-8");
    await fs.writeFile(dataPath, defaultContent, "utf-8");
  }

  return dataPath;
}

async function loadData(filePath = null) {
  const dataPath = filePath || currentDataPath || (await ensureDataFile());
  const text = await fs.readFile(dataPath, "utf-8");
  const parsed = JSON.parse(text);
  currentDataPath = dataPath;
  return parsed;
}

async function saveData(payload, filePath = null) {
  if (!payload || !Array.isArray(payload.teams)) {
    throw new Error("Invalid data format. Expected root object with teams array.");
  }

  const dataPath = filePath || currentDataPath || (await ensureDataFile());
  const serialized = JSON.stringify(payload, null, 2);
  await fs.writeFile(dataPath, serialized, "utf-8");
  currentDataPath = dataPath;
  return dataPath;
}

async function promptOpenDataFile(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    title: "チームデータを開く",
    properties: ["openFile"],
    filters: DATA_FILE_FILTERS,
    defaultPath: currentDataPath || app.getPath("documents")
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}

async function promptInitialDataFile() {
  const selectedPath = await promptOpenDataFile(null);
  if (selectedPath) {
    currentDataPath = selectedPath;
  }
}

async function openDataFileFromMenu(browserWindow) {
  const selectedPath = await promptOpenDataFile(browserWindow);
  if (!selectedPath) return;

  try {
    const data = await loadData(selectedPath);
    updateWindowTitle(browserWindow);
    browserWindow.webContents.send("teams:data-loaded", { data, dataPath: selectedPath });
  } catch (error) {
    dialog.showErrorBox("ファイルを開けません", error.message);
  }
}

function buildApplicationMenu() {
  const template = [
    {
      label: "ファイル",
      submenu: [
        {
          label: "開く...",
          accelerator: "CmdOrCtrl+O",
          click: (_menuItem, browserWindow) => {
            if (!browserWindow) return;
            void openDataFileFromMenu(browserWindow);
          }
        },
        {
          label: "保存",
          accelerator: "CmdOrCtrl+S",
          click: (_menuItem, browserWindow) => {
            if (!browserWindow) return;
            browserWindow.webContents.send("menu:file-save-request");
          }
        },
        { type: "separator" },
        process.platform === "darwin" ? { role: "close" } : { role: "quit" }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1000,
    minHeight: 720,
    title: APP_TITLE,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(buildApplicationMenu());
  updateWindowTitle(mainWindow);
  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));
}

ipcMain.handle("teams:load", async (event) => {
  const data = await loadData();
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  updateWindowTitle(browserWindow);
  return data;
});

ipcMain.handle("teams:save", async (event, payload) => {
  const dataPath = await saveData(payload);
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  updateWindowTitle(browserWindow);
  return { ok: true, dataPath };
});

app.whenReady().then(async () => {
  await promptInitialDataFile();
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
