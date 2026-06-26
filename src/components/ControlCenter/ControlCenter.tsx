import { BatteryCharging, Bluetooth, Focus, Moon, Plane, Sun, Volume2, Wifi, Zap } from "lucide-react";
import styles from "./ControlCenter.module.css";

interface ControlCenterProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const controls = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi, active: true },
  { id: "bluetooth", label: "Bluetooth", icon: Bluetooth, active: true },
  { id: "airplane", label: "Airplane", icon: Plane, active: false },
  { id: "focus", label: "Focus", icon: Focus, active: false },
  { id: "flashlight", label: "Flashlight", icon: Zap, active: false },
  { id: "battery", label: "Battery", icon: BatteryCharging, active: false }
];

export function ControlCenter({ isDark, onToggleTheme }: ControlCenterProps) {
  return (
    <aside className={styles.controlCenter} aria-label="Control Center">
      <div className={styles.tiles}>
        {controls.map((control) => {
          const Icon = control.icon;
          return (
            <button key={control.id} className={styles.tile} data-active={control.active} type="button">
              <Icon size={19} />
              <span>{control.label}</span>
            </button>
          );
        })}
        <button className={styles.tile} data-active={isDark} onClick={onToggleTheme} type="button">
          <Moon size={19} />
          <span>Dark Mode</span>
        </button>
      </div>
      <label className={styles.slider}>
        <span><Sun size={17} /> Brightness</span>
        <input type="range" min="0" max="100" defaultValue="76" />
      </label>
      <label className={styles.slider}>
        <span><Volume2 size={17} /> Volume</span>
        <input type="range" min="0" max="100" defaultValue="54" />
      </label>
    </aside>
  );
}
