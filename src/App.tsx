import { useEffect, useState } from "react";
import { BootScreen } from "./pages/BootScreen/BootScreen";
import { LockScreen } from "./pages/LockScreen/LockScreen";
import { Desktop } from "./layouts/Desktop/Desktop";
import { initialNotifications } from "./core/NotificationManager/notificationSeed";
import { applyNovaTheme } from "./core/ThemeManager/themeManager";
import type { NovaMode, NovaTheme } from "./types/nova";

export function App() {
  const [mode, setMode] = useState<NovaMode>("booting");
  const [date, setDate] = useState(new Date());
  const [theme, setTheme] = useState<NovaTheme>("dark");

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setMode("locked"), 1800);
    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const ticker = window.setInterval(() => setDate(new Date()), 1000);
    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    applyNovaTheme(theme);
  }, [theme]);

  if (mode === "booting") {
    return <BootScreen />;
  }

  if (mode === "locked") {
    return <LockScreen date={date} notifications={initialNotifications} onUnlock={() => setMode("home")} />;
  }

  return (
    <Desktop
      date={date}
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
    />
  );
}
