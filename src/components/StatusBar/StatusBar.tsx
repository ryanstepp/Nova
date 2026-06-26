import { Battery, Bluetooth, Moon, Search, Wifi } from "lucide-react";
import styles from "./StatusBar.module.css";

interface StatusBarProps {
  date: Date;
  onSearch: () => void;
  onToggleTheme: () => void;
  onToggleControlCenter: () => void;
}

export function StatusBar({ date, onSearch, onToggleTheme, onToggleControlCenter }: StatusBarProps) {
  return (
    <header className={styles.statusBar}>
      <div className={styles.brand}>Nova</div>
      <button className={styles.searchButton} type="button" onClick={onSearch}>
        <Search size={16} />
        <span>Search</span>
      </button>
      <div className={styles.tray}>
        <button aria-label="Toggle theme" className={styles.iconButton} onClick={onToggleTheme} type="button">
          <Moon size={16} />
        </button>
        <button aria-label="Open Control Center" className={styles.trayCluster} onClick={onToggleControlCenter} type="button">
          <Wifi size={16} />
          <Bluetooth size={16} />
          <Battery size={17} />
        </button>
        <time>{date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
      </div>
    </header>
  );
}
