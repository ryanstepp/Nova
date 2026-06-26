import type { ComponentType } from "react";

export type NovaMode = "booting" | "setup" | "locked" | "home";
export type NovaTheme = "dark" | "light";
export type NotificationPriority = "low" | "normal" | "high";

export type NovaWallpaper = "aurora" | "ember" | "lagoon" | "mono";

export interface NovaPreferences {
  theme: NovaTheme;
  wallpaper: NovaWallpaper;
  customWallpaper: string | null;
  accentColor: string;
  cornerRadius: number;
  glassOpacity: number;
  fontScale: number;
  dockScale: number;
  motionSpeed: number;
  showWidgets: boolean;
  showAppLabels: boolean;
}

export interface NovaApp {
  id: string;
  name: string;
  icon: string;
  accent: string;
  description: string;
  component: ComponentType<NovaAppProps>;
}

export interface NovaAppProps {
  app: NovaApp;
  preferences: NovaPreferences;
  updatePreferences: (preferences: Partial<NovaPreferences>) => void;
}

export interface AppWindowState {
  appId: string;
  isOpen: boolean;
  lastOpenedAt: number;
  state: Record<string, unknown>;
}

export interface NovaNotification {
  id: string;
  appId: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  createdAt: string;
  group: string;
}

export interface SettingCategory {
  id: string;
  name: string;
  description: string;
}

export interface SearchResult {
  id: string;
  type: "app" | "file" | "setting" | "history" | "note" | "calculator";
  title: string;
  subtitle: string;
  action: string;
}

export interface UpdateState {
  currentVersion: string;
  availableVersion: string | null;
  automaticUpdates: false;
  status: "idle" | "checking" | "available" | "downloading" | "ready" | "installed";
  releaseNotes: string[];
  lastCheckedAt: string | null;
}
