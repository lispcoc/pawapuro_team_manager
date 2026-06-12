const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("teamApi", {
  load: () => ipcRenderer.invoke("teams:load"),
  save: (payload) => ipcRenderer.invoke("teams:save", payload)
});
