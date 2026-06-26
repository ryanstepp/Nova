import { AppIcon } from "../AppIcon/AppIcon";
import type { NovaApp, NovaPreferences } from "../../types/nova";
import styles from "./Dock.module.css";

interface DockProps {
  apps: NovaApp[];
  preferences: NovaPreferences;
  runningAppIds: string[];
  onOpen: (appId: string) => void;
}

export function Dock({ apps, preferences, runningAppIds, onOpen }: DockProps) {
  return (
    <nav className={styles.dock} aria-label="Dock">
      {apps.map((app) => (
        <AppIcon key={app.id} app={app} preferences={preferences} isRunning={runningAppIds.includes(app.id)} onOpen={onOpen} />
      ))}
    </nav>
  );
}
