const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("teamApi", {
  load: () => ipcRenderer.invoke("teams:load"),
  save: (payload) => ipcRenderer.invoke("teams:save", payload),
  onDataLoaded: (handler) => {
    ipcRenderer.on("teams:data-loaded", (_event, payload) => {
      handler(payload);
    });
  },
  onMenuSaveRequest: (handler) => {
    ipcRenderer.on("menu:file-save-request", () => {
      handler();
    });
  }
});
