import type { SettingCategory } from "../../types/nova";

export const settingCategories: SettingCategory[] = [
  { id: "general", name: "General", description: "Language, region, startup, and system behavior." },
  { id: "appearance", name: "Appearance", description: "Themes, materials, motion, and typography." },
  { id: "wallpaper", name: "Wallpaper", description: "Desktop and lock screen background collections." },
  { id: "lock-screen", name: "Lock Screen", description: "Clock, previews, and unlock preferences." },
  { id: "home-screen", name: "Home Screen", description: "App grid, widgets, and dock layout." },
  { id: "notifications", name: "Notifications", description: "Notification grouping, priority, and previews." },
  { id: "control-center", name: "Control Center", description: "Quick controls and future customization." },
  { id: "privacy", name: "Privacy", description: "Permissions, activity, and local data controls." },
  { id: "security", name: "Security", description: "Passcode, session, and app trust settings." },
  { id: "display", name: "Display", description: "Brightness, scaling, and color preferences." },
  { id: "accessibility", name: "Accessibility", description: "Motion, contrast, audio, and input support." },
  { id: "storage", name: "Storage", description: "Local files, cache, and application data." },
  { id: "apps", name: "Apps", description: "Installed applications and defaults." },
  { id: "browser", name: "Browser", description: "History, search engine, tabs, and privacy." },
  { id: "software-update", name: "Software Update", description: "Manual update checks and release notes." },
  { id: "about", name: "About", description: "Device identity, build, and legal information." }
];
