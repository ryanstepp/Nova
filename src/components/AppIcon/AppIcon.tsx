import type { CSSProperties } from "react";
import type { NovaApp } from "../../types/nova";
import styles from "./AppIcon.module.css";

interface AppIconProps {
  app: NovaApp;
  isRunning?: boolean;
  onOpen: (appId: string) => void;
}

export function AppIcon({ app, isRunning = false, onOpen }: AppIconProps) {
  return (
    <button className={styles.appIcon} onClick={() => onOpen(app.id)} type="button">
      <span className={styles.glyph} style={{ "--accent": app.accent } as CSSProperties}>
        {app.icon}
      </span>
      <span className={styles.name}>{app.name}</span>
      {isRunning ? <span className={styles.running} /> : null}
    </button>
  );
}
