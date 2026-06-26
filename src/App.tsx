import { useEffect, useState } from "react";
import { BootScreen } from "./pages/BootScreen/BootScreen";
import { LockScreen } from "./pages/LockScreen/LockScreen";
import { Desktop } from "./layouts/Desktop/Desktop";
import { initialNotifications } from "./core/NotificationManager/notificationSeed";
import { loadPreferences, savePreferences } from "./core/SettingsManager/preferences";
import { applyNovaTheme } from "./core/ThemeManager/themeManager";
import type { NovaMode, NovaPreferences } from "./types/nova";

export function App() {
  const [mode, setMode] = useState<NovaMode>("booting");
  const [date, setDate] = useState(new Date());
  const [preferences, setPreferences] = useState<NovaPreferences>(() => loadPreferences());

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setMode("locked"), 1800);
    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const ticker = window.setInterval(() => setDate(new Date()), 1000);
    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    applyNovaTheme(preferences);
    savePreferences(preferences);
  }, [preferences]);

  function updatePreferences(nextPreferences: Partial<NovaPreferences>) {
    setPreferences((current) => ({ ...current, ...nextPreferences }));
  }

  if (mode === "booting") {
    return <BootScreen />;
  }

  if (mode === "locked") {
    return <LockScreen date={date} notifications={initialNotifications} onUnlock={() => setMode("home")} />;
  }

  return (
    <Desktop
      date={date}
      preferences={preferences}
      updatePreferences={updatePreferences}
    />
  );
}
