const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("teamApi", {
  load: () => ipcRenderer.invoke("teams:load"),
  save: (payload, options) => ipcRenderer.invoke("teams:save", payload, options),
  openFile: () => ipcRenderer.invoke("teams:open-file"),
  confirmSaveBeforeOpen: () => ipcRenderer.invoke("teams:confirm-save-before-open"),
  notifyCloseApp: () => ipcRenderer.send("close-app"),
  onDataLoaded: (handler) => {
    ipcRenderer.on("teams:data-loaded", (_event, payload) => {
      handler(payload);
    });
  },
  onMenuOpenRequest: (handler) => {
    ipcRenderer.on("menu:file-open-request", () => {
      handler();
    });
  },
  onMenuSaveRequest: (handler) => {
    ipcRenderer.on("menu:file-save-request", () => {
      handler();
    });
  },
  onMenuSaveAsRequest: (handler) => {
    ipcRenderer.on("menu:file-save-as-request", () => {
      handler();
    });
  },
  onMenuOpenSettingsRequest: (handler) => {
    ipcRenderer.on("menu:open-settings-request", () => {
      handler();
    });
  },
  onRequestCheckUnsavedData: (handler) => {
    ipcRenderer.on("request-check-unsaved-data", async () => {
      const result = await handler();
      ipcRenderer.send("renderer-unsaved-data-response", result);
    });
  },
  onAppSaveAndClose: (handler) => {
    ipcRenderer.on("app:save-and-close", () => {
      handler();
    });
  }
});
