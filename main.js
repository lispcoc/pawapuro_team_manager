const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");

const DATA_FILE_NAME = "teams.json";
const DEFAULT_DATA_PATH = path.join(__dirname, "data", "teams.default.json");

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

async function loadData() {
  const dataPath = await ensureDataFile();
  const text = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(text);
}

async function saveData(payload) {
  if (!payload || !Array.isArray(payload.teams)) {
    throw new Error("Invalid data format. Expected root object with teams array.");
  }

  const dataPath = await ensureDataFile();
  const serialized = JSON.stringify(payload, null, 2);
  await fs.writeFile(dataPath, serialized, "utf-8");
  return dataPath;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 1000,
    minHeight: 720,
    title: "パワプロ チームマネージャ",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));
}

ipcMain.handle("teams:load", async () => {
  return loadData();
});

ipcMain.handle("teams:save", async (_event, payload) => {
  const dataPath = await saveData(payload);
  return { ok: true, dataPath };
});

app.whenReady().then(() => {
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
