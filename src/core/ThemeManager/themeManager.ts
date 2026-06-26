import type { NovaPreferences } from "../../types/nova";
import { wallpaperPalettes } from "../SettingsManager/preferences";

export function applyNovaTheme(preferences: NovaPreferences) {
  const root = document.documentElement;
  const wallpaper = wallpaperPalettes[preferences.wallpaper];

  root.dataset.theme = preferences.theme;
  root.style.setProperty("--wallpaper-a", wallpaper.colors[0]);
  root.style.setProperty("--wallpaper-b", wallpaper.colors[1]);
  root.style.setProperty("--wallpaper-c", wallpaper.colors[2]);
  root.style.setProperty("--custom-wallpaper", preferences.customWallpaper ? `url("${preferences.customWallpaper}")` : "none");
  root.style.setProperty("--accent-active", preferences.accentColor);
  root.style.setProperty("--focus-ring", preferences.accentColor);
  root.style.setProperty("--radius-ui", `${preferences.cornerRadius}px`);
  root.style.setProperty("--glass-opacity", `${preferences.glassOpacity / 100}`);
  root.style.setProperty("--font-scale", `${preferences.fontScale / 100}`);
  root.style.setProperty("--dock-scale", `${preferences.dockScale / 100}`);
  root.style.setProperty("--motion-speed", `${preferences.motionSpeed / 100}`);
}
