import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("nova", {
  platform: process.platform
});
