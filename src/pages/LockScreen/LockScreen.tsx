import type { NovaNotification } from "../../types/nova";
import styles from "./LockScreen.module.css";

interface LockScreenProps {
  date: Date;
  notifications: NovaNotification[];
  onUnlock: () => void;
}

export function LockScreen({ date, notifications, onUnlock }: LockScreenProps) {
  return (
    <main className={styles.lockScreen}>
      <section className={styles.clock}>
        <time className={styles.time}>{date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
        <time className={styles.date}>
          {date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </time>
      </section>
      <section className={styles.preview} aria-label="Notification previews">
        {notifications.slice(0, 2).map((notification) => (
          <article key={notification.id} className={styles.notification}>
            <strong>{notification.title}</strong>
            <span>{notification.message}</span>
          </article>
        ))}
      </section>
      <button className={styles.unlock} onClick={onUnlock} type="button">
        Unlock Nova
      </button>
    </main>
  );
}
