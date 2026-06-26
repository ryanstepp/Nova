import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { novaApps } from "../../apps/appCatalog";
import { AppIcon } from "../../components/AppIcon/AppIcon";
import { ControlCenter } from "../../components/ControlCenter/ControlCenter";
import { Dock } from "../../components/Dock/Dock";
import { NotificationCenter } from "../../components/NotificationCenter/NotificationCenter";
import { SearchOverlay } from "../../components/SearchOverlay/SearchOverlay";
import { StatusBar } from "../../components/StatusBar/StatusBar";
import { WindowSurface } from "../../components/WindowSurface/WindowSurface";
import { initialNotifications } from "../../core/NotificationManager/notificationSeed";
import { searchNova } from "../../core/SearchManager/searchManager";
import { useWindowManager } from "../../core/WindowManager/useWindowManager";
import type { NovaNotification, NovaTheme } from "../../types/nova";
import styles from "./Desktop.module.css";

interface DesktopProps {
  date: Date;
  theme: NovaTheme;
  onToggleTheme: () => void;
}

export function Desktop({ date, theme, onToggleTheme }: DesktopProps) {
  const windowManager = useWindowManager(novaApps);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState<NovaNotification[]>(initialNotifications);
  const runningAppIds = windowManager.openApps.map((app) => app.id);
  const dockApps = novaApps.filter((app) => ["files", "browser", "notes", "calculator", "settings"].includes(app.id));
  const results = useMemo(() => searchNova(query, novaApps), [query]);

  function openApp(appId: string) {
    windowManager.openApp(appId);
    setIsSearchOpen(false);
  }

  return (
    <main className={styles.desktop}>
      <StatusBar
        date={date}
        onSearch={() => setIsSearchOpen(true)}
        onToggleTheme={onToggleTheme}
        onToggleControlCenter={() => {
          setIsControlCenterOpen((value) => !value);
          setIsNotificationsOpen(false);
        }}
      />

      <button
        className={styles.notificationButton}
        aria-label="Open Notification Center"
        onClick={() => {
          setIsNotificationsOpen((value) => !value);
          setIsControlCenterOpen(false);
        }}
        type="button"
      >
        <Bell size={17} />
        {notifications.length ? <span>{notifications.length}</span> : null}
      </button>

      <section className={styles.homeGrid} aria-label="Home Screen">
        <div className={styles.widget}>
          <span>Today</span>
          <strong>{date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</strong>
          <p>Widgets are scaffolded for weather, calendar, focus, and system health.</p>
        </div>
        <div className={styles.apps}>
          {novaApps.map((app) => (
            <AppIcon key={app.id} app={app} isRunning={runningAppIds.includes(app.id)} onOpen={openApp} />
          ))}
        </div>
      </section>

      {windowManager.activeApp ? <WindowSurface app={windowManager.activeApp} onClose={windowManager.closeApp} /> : null}

      <Dock apps={dockApps} runningAppIds={runningAppIds} onOpen={openApp} />

      {isSearchOpen ? (
        <SearchOverlay query={query} results={results} onChange={setQuery} onClose={() => setIsSearchOpen(false)} />
      ) : null}

      {isNotificationsOpen ? (
        <NotificationCenter
          notifications={notifications}
          onClearAll={() => setNotifications([])}
          onClear={(id) => setNotifications((current) => current.filter((item) => item.id !== id))}
        />
      ) : null}

      {isControlCenterOpen ? <ControlCenter isDark={theme === "dark"} onToggleTheme={onToggleTheme} /> : null}
    </main>
  );
}
