import { X } from "lucide-react";
import type { NovaNotification } from "../../types/nova";
import styles from "./NotificationCenter.module.css";

interface NotificationCenterProps {
  notifications: NovaNotification[];
  onClearAll: () => void;
  onClear: (id: string) => void;
}

export function NotificationCenter({ notifications, onClearAll, onClear }: NotificationCenterProps) {
  const groups = notifications.reduce<Record<string, NovaNotification[]>>((current, notification) => {
    current[notification.group] = [...(current[notification.group] ?? []), notification];
    return current;
  }, {});

  return (
    <aside className={styles.center} aria-label="Notification Center">
      <header>
        <h2>Notifications</h2>
        <button onClick={onClearAll} type="button">Clear all</button>
      </header>
      <div className={styles.groups}>
        {Object.entries(groups).map(([group, items]) => (
          <section key={group} className={styles.group}>
            <h3>{group}</h3>
            {items.map((item) => (
              <article key={item.id} className={styles.notification} data-priority={item.priority}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                </div>
                <button aria-label={`Clear ${item.title}`} onClick={() => onClear(item.id)} type="button">
                  <X size={16} />
                </button>
              </article>
            ))}
          </section>
        ))}
        {!notifications.length ? <p className={styles.empty}>All clear.</p> : null}
      </div>
    </aside>
  );
}
