import type { CSSProperties } from "react";
import type { NovaApp, NovaPreferences } from "../../types/nova";
import { appIconOverrides } from "../../apps/appIconOverrides";
import styles from "./AppIcon.module.css";

interface AppIconProps {
  app: NovaApp;
  preferences: NovaPreferences;
  isRunning?: boolean;
  onOpen: (appId: string) => void;
}

export function AppIcon({ app, preferences, isRunning = false, onOpen }: AppIconProps) {
  const customIcon = appIconOverrides[app.id];

  return (
    <button className={styles.appIcon} onClick={() => onOpen(app.id)} type="button">
      <span className={styles.glyph} style={{ "--accent": app.accent } as CSSProperties}>
        {customIcon ? <img src={customIcon} alt="" /> : app.icon}
      </span>
      {preferences.showAppLabels ? <span className={styles.name}>{app.name}</span> : null}
      {isRunning ? <span className={styles.running} /> : null}
    </button>
  );
}
