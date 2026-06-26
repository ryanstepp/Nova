import type { CSSProperties } from "react";
import { X } from "lucide-react";
import type { NovaApp, NovaPreferences } from "../../types/nova";
import styles from "./WindowSurface.module.css";

interface WindowSurfaceProps {
  app: NovaApp;
  preferences: NovaPreferences;
  updatePreferences: (preferences: Partial<NovaPreferences>) => void;
  onClose: (appId: string) => void;
}

export function WindowSurface({ app, preferences, updatePreferences, onClose }: WindowSurfaceProps) {
  const AppComponent = app.component;

  return (
    <section className={styles.windowSurface} aria-label={`${app.name} window`}>
      <header className={styles.titleBar}>
        <div className={styles.identity}>
          <span style={{ "--accent": app.accent } as CSSProperties}>{app.icon}</span>
          <strong>{app.name}</strong>
        </div>
        <button aria-label={`Close ${app.name}`} onClick={() => onClose(app.id)} type="button">
          <X size={18} />
        </button>
      </header>
      <div className={styles.content}>
        <AppComponent app={app} preferences={preferences} updatePreferences={updatePreferences} />
      </div>
    </section>
  );
}
