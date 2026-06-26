import type { NovaNotification } from "../../types/nova";

export const initialNotifications: NovaNotification[] = [
  {
    id: "system-welcome",
    appId: "settings",
    title: "Welcome to Nova",
    message: "Your desktop is ready. Automatic updates are off by default.",
    priority: "high",
    createdAt: new Date().toISOString(),
    group: "System"
  },
  {
    id: "files-sync",
    appId: "files",
    title: "Files indexed",
    message: "Documents, media, and downloads are ready for search.",
    priority: "normal",
    createdAt: new Date().toISOString(),
    group: "Files"
  }
];
