import type { NovaPreferences, NovaWallpaper } from "../../types/nova";

const storageKey = "nova.preferences";

export const wallpaperPalettes: Record<NovaWallpaper, { name: string; colors: [string, string, string] }> = {
  aurora: { name: "Aurora", colors: ["#172235", "#171d2a", "#11151f"] },
  ember: { name: "Ember", colors: ["#331b25", "#2a1e17", "#141016"] },
  lagoon: { name: "Lagoon", colors: ["#10323b", "#14312f", "#111827"] },
  mono: { name: "Mono", colors: ["#20242c", "#171a20", "#0f1115"] }
};

export const defaultPreferences: NovaPreferences = {
  theme: "dark",
  wallpaper: "aurora",
  accentColor: "#5be7c4",
  cornerRadius: 8,
  glassOpacity: 62,
  fontScale: 100,
  dockScale: 100,
  motionSpeed: 100,
  showWidgets: true
};

export function loadPreferences(): NovaPreferences {
  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return defaultPreferences;
  }

  try {
    return { ...defaultPreferences, ...JSON.parse(saved) };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(preferences: NovaPreferences) {
  window.localStorage.setItem(storageKey, JSON.stringify(preferences));
}

export function resetPreferences(): NovaPreferences {
  savePreferences(defaultPreferences);
  return defaultPreferences;
}
