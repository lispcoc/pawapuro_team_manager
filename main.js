const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs/promises");

const DATA_FILE_FILTERS = [{ name: "JSON", extensions: ["json"] }];
const APP_TITLE = "パワプロ チームマネージャ";
const OPEN_DIALOG_DEFAULT_DIRECTORY_MODES = {
  DOCUMENTS: "documents",
  LAST_OPENED_DIRECTORY: "last-opened-directory"
};

let currentDataPath = null;

function createEmptyTeamData() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    version: 1,
    updatedAt: today,
    teams: []
  };
}

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

async function loadData(filePath = null) {
  const dataPath = filePath || currentDataPath;
  if (!dataPath) {
    return createEmptyTeamData();
  }

  const text = await fs.readFile(dataPath, "utf-8");
  const parsed = JSON.parse(text);
  currentDataPath = dataPath;
  return parsed;
}

async function promptSaveDataFile(browserWindow) {
  const result = await dialog.showSaveDialog(browserWindow, {
    title: "チームデータを保存",
    filters: DATA_FILE_FILTERS,
    defaultPath: currentDataPath || app.getPath("documents")
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  return result.filePath;
}

async function saveData(payload, options = {}) {
  if (!payload || !Array.isArray(payload.teams)) {
    throw new Error("Invalid data format. Expected root object with teams array.");
  }

  const { filePath = null, saveAs = false, browserWindow = null } = options;
  let dataPath = filePath || currentDataPath;

  if (saveAs || !dataPath) {
    dataPath = await promptSaveDataFile(browserWindow);
    if (!dataPath) {
      return { canceled: true, dataPath: currentDataPath };
    }
  }

  const serialized = JSON.stringify(payload, null, 2);
  await fs.writeFile(dataPath, serialized, "utf-8");
  currentDataPath = dataPath;
  return { canceled: false, dataPath };
}

function resolveOpenDialogDefaultPath(options = {}) {
  const mode = String(options?.defaultDirectoryMode || OPEN_DIALOG_DEFAULT_DIRECTORY_MODES.DOCUMENTS).trim();
  const explicitLastOpenedPath = String(options?.lastOpenedFilePath || "").trim();

  if (mode === OPEN_DIALOG_DEFAULT_DIRECTORY_MODES.LAST_OPENED_DIRECTORY) {
    const candidatePaths = [explicitLastOpenedPath, currentDataPath].filter(Boolean);
    for (const candidatePath of candidatePaths) {
      if (path.isAbsolute(candidatePath)) {
        return path.dirname(candidatePath);
      }
    }
  }

  return app.getPath("documents");
}

async function promptOpenDataFileWithOptions(browserWindow, options = {}) {
  const result = await dialog.showOpenDialog(browserWindow, {
    title: "チームデータを開く",
    properties: ["openFile"],
    filters: DATA_FILE_FILTERS,
    defaultPath: resolveOpenDialogDefaultPath(options)
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
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
            browserWindow.webContents.send("menu:file-open-request");
          }
        },
        {
          label: "上書き保存",
          accelerator: "CmdOrCtrl+S",
          click: (_menuItem, browserWindow) => {
            if (!browserWindow) return;
            browserWindow.webContents.send("menu:file-save-request");
          }
        },
        {
          label: "名前を付けて保存...",
          accelerator: "CmdOrCtrl+Shift+S",
          click: (_menuItem, browserWindow) => {
            if (!browserWindow) return;
            browserWindow.webContents.send("menu:file-save-as-request");
          }
        },
        { type: "separator" },
        process.platform === "darwin" ? { role: "close" } : { role: "quit" }
      ]
    },
    {
      label: "設定",
      submenu: [
        {
          label: "表示設定...",
          accelerator: "CmdOrCtrl+,",
          click: (_menuItem, browserWindow) => {
            if (!browserWindow) return;
            browserWindow.webContents.send("menu:open-settings-request");
          }
        }
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

  mainWindow.on("close", async (event) => {
    if (mainWindow.isDestroyed()) {
      return;
    }

    event.preventDefault();

    let hasUnsaved = false;
    try {
      hasUnsaved = await new Promise((resolve) => {
        let responded = false;
        const timeout = setTimeout(() => {
          if (!responded) {
            responded = true;
            resolve(false);
          }
        }, 1000);

        const handleResponse = (_event, result) => {
          if (responded) return;
          responded = true;
          clearTimeout(timeout);
          ipcMain.removeListener("renderer-unsaved-data-response", handleResponse);
          resolve(result);
        };

        ipcMain.once("renderer-unsaved-data-response", handleResponse);
        mainWindow.webContents.send("request-check-unsaved-data");
      });
    } catch (error) {
      console.error("Failed to check unsaved data:", error);
    }

    if (!hasUnsaved) {
      mainWindow.destroy();
      return;
    }

    const result = await dialog.showMessageBox(mainWindow, {
      type: "warning",
      buttons: ["保存して終了", "保存しないで終了", "キャンセル"],
      defaultId: 0,
      cancelId: 2,
      title: "未保存の変更があります",
      message: "現在の変更を保存しますか？",
      detail: "このアプリケーションを終了する前に、現在の編集内容を保存できます。"
    });

    if (result.response === 0) {
      // 保存して終了
      mainWindow.webContents.send("app:save-and-close");
    } else if (result.response === 1) {
      // 保存しないで終了
      mainWindow.destroy();
    }
    // response === 2 の場合はキャンセル
  });
}

ipcMain.handle("teams:load", async (event) => {
  const data = await loadData();
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  updateWindowTitle(browserWindow);
  return data;
});

ipcMain.handle("teams:save", async (event, payload, options = {}) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const result = await saveData(payload, {
    ...options,
    browserWindow
  });

  if (result.canceled) {
    return { ok: false, canceled: true, dataPath: result.dataPath || null };
  }

  updateWindowTitle(browserWindow);
  return { ok: true, canceled: false, dataPath: result.dataPath };
});

ipcMain.handle("teams:open-file", async (event, options = {}) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const selectedPath = await promptOpenDataFileWithOptions(browserWindow, options);
  if (!selectedPath) {
    return { ok: false, canceled: true };
  }

  const data = await loadData(selectedPath);
  updateWindowTitle(browserWindow);
  return { ok: true, canceled: false, dataPath: selectedPath, data };
});

ipcMain.handle("teams:open-specific-file", async (event, filePath) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const targetPath = String(filePath || "").trim();
  if (!targetPath) {
    return { ok: false, canceled: true, error: "ファイルパスが指定されていません。" };
  }

  try {
    const data = await loadData(targetPath);
    updateWindowTitle(browserWindow);
    return { ok: true, canceled: false, dataPath: targetPath, data };
  } catch (error) {
    return { ok: false, canceled: false, error: error.message || "ファイルを開けませんでした。" };
  }
});

ipcMain.handle("teams:confirm-save-before-open", async (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showMessageBox(browserWindow, {
    type: "warning",
    buttons: ["保存する", "保存しない", "キャンセル"],
    defaultId: 0,
    cancelId: 2,
    title: "未保存の変更があります",
    message: "現在の変更を保存しますか？",
    detail: "別のファイルを開く前に、現在の編集内容を保存できます。"
  });

  if (result.response === 0) return "save";
  if (result.response === 1) return "discard";
  return "cancel";
});

ipcMain.on("close-app", () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    mainWindow.destroy();
  }
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
