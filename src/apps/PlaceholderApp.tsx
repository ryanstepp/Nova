import type { CSSProperties } from "react";
import type { NovaAppProps } from "../types/nova";
import styles from "./PlaceholderApp.module.css";

export function PlaceholderApp({ app }: NovaAppProps) {
  return (
    <section className={styles.appSurface}>
      <div className={styles.hero} style={{ "--accent": app.accent } as CSSProperties}>
        <span className={styles.icon}>{app.icon}</span>
        <div>
          <h2>{app.name}</h2>
          <p>{app.description}</p>
        </div>
      </div>
      <div className={styles.panelGrid}>
        <article>
          <span>State</span>
          <strong>Kept in memory</strong>
        </article>
        <article>
          <span>Surface</span>
          <strong>Ready for expansion</strong>
        </article>
        <article>
          <span>Version</span>
          <strong>Nova 0.1</strong>
        </article>
      </div>
    </section>
  );
}
