import { useMemo, useState } from "react";
import type { AppWindowState, NovaApp } from "../../types/nova";

export function useWindowManager(apps: NovaApp[]) {
  const [windows, setWindows] = useState<Record<string, AppWindowState>>({});
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const activeApp = useMemo(
    () => apps.find((app) => app.id === activeAppId) ?? null,
    [activeAppId, apps]
  );

  const openApps = useMemo(
    () =>
      apps.filter((app) => {
        const windowState = windows[app.id];
        return windowState?.isOpen;
      }),
    [apps, windows]
  );

  function openApp(appId: string) {
    setWindows((current) => ({
      ...current,
      [appId]: {
        appId,
        isOpen: true,
        lastOpenedAt: Date.now(),
        state: current[appId]?.state ?? {}
      }
    }));
    setActiveAppId(appId);
  }

  function closeApp(appId: string) {
    setWindows((current) => ({
      ...current,
      [appId]: {
        ...(current[appId] ?? { appId, lastOpenedAt: Date.now(), state: {} }),
        isOpen: false
      }
    }));
    setActiveAppId((current) => (current === appId ? null : current));
  }

  function switchApp(appId: string) {
    if (windows[appId]?.isOpen) {
      setActiveAppId(appId);
    }
  }

  return {
    activeApp,
    activeAppId,
    closeApp,
    openApp,
    openApps,
    switchApp,
    windows
  };
}
