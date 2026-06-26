import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { resetPreferences, wallpaperPalettes } from "../core/SettingsManager/preferences";
import { settingCategories } from "../core/SettingsManager/settingsCatalog";
import type { NovaAppProps, NovaPreferences, NovaWallpaper } from "../types/nova";
import styles from "./SettingsApp.module.css";

const accentPresets = ["#5be7c4", "#6ab7ff", "#ff7ab8", "#ffd166", "#a3e635", "#f78c6b"];

export function SettingsApp({ preferences, updatePreferences }: NovaAppProps) {
  function updateNumber(key: keyof NovaPreferences, value: string) {
    updatePreferences({ [key]: Number(value) } as Partial<NovaPreferences>);
  }

  return (
    <section className={styles.settings}>
      <aside className={styles.sidebar}>
        {settingCategories.map((category) => (
          <button key={category.id} className={category.id === "appearance" ? styles.active : undefined} type="button">
            <strong>{category.name}</strong>
            <span>{category.description}</span>
          </button>
        ))}
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2>Customize Nova</h2>
            <p>Change the desktop, lock screen, dock, glass, motion, and colors from here.</p>
          </div>
          <button className={styles.reset} onClick={() => updatePreferences(resetPreferences())} type="button">
            <RotateCcw size={17} />
            Reset
          </button>
        </header>

        <section className={styles.section}>
          <h3>Theme</h3>
          <div className={styles.segmented}>
            {(["dark", "light"] as const).map((theme) => (
              <button
                key={theme}
                data-active={preferences.theme === theme}
                onClick={() => updatePreferences({ theme })}
                type="button"
              >
                {theme}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3>Wallpaper</h3>
          <div className={styles.wallpapers}>
            {(Object.keys(wallpaperPalettes) as NovaWallpaper[]).map((wallpaper) => (
              <button
                key={wallpaper}
                className={styles.wallpaper}
                data-active={preferences.wallpaper === wallpaper}
                onClick={() => updatePreferences({ wallpaper })}
                type="button"
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${wallpaperPalettes[wallpaper].colors.join(", ")})`
                  }}
                />
                <strong>{wallpaperPalettes[wallpaper].name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3>Accent Color</h3>
          <div className={styles.colors}>
            {accentPresets.map((color) => (
              <button
                key={color}
                aria-label={`Use ${color}`}
                data-active={preferences.accentColor === color}
                onClick={() => updatePreferences({ accentColor: color })}
                style={{ background: color }}
                type="button"
              />
            ))}
            <label className={styles.colorPicker}>
              <span>Custom</span>
              <input
                type="color"
                value={preferences.accentColor}
                onChange={(event) => updatePreferences({ accentColor: event.target.value })}
              />
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Interface</h3>
          <div className={styles.controls}>
            <Control label="Corners" value={`${preferences.cornerRadius}px`}>
              <input min="2" max="24" type="range" value={preferences.cornerRadius} onChange={(event) => updateNumber("cornerRadius", event.target.value)} />
            </Control>
            <Control label="Glass" value={`${preferences.glassOpacity}%`}>
              <input min="20" max="90" type="range" value={preferences.glassOpacity} onChange={(event) => updateNumber("glassOpacity", event.target.value)} />
            </Control>
            <Control label="Text Size" value={`${preferences.fontScale}%`}>
              <input min="85" max="120" type="range" value={preferences.fontScale} onChange={(event) => updateNumber("fontScale", event.target.value)} />
            </Control>
            <Control label="Dock Size" value={`${preferences.dockScale}%`}>
              <input min="80" max="125" type="range" value={preferences.dockScale} onChange={(event) => updateNumber("dockScale", event.target.value)} />
            </Control>
            <Control label="Motion" value={`${preferences.motionSpeed}%`}>
              <input min="50" max="150" type="range" value={preferences.motionSpeed} onChange={(event) => updateNumber("motionSpeed", event.target.value)} />
            </Control>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Home Screen</h3>
          <label className={styles.toggle}>
            <input
              checked={preferences.showWidgets}
              onChange={(event) => updatePreferences({ showWidgets: event.target.checked })}
              type="checkbox"
            />
            <span>Show widgets</span>
          </label>
        </section>

        <section className={styles.preview}>
          <span>Preview</span>
          <div>
            <strong>Nova</strong>
            <p>These choices are saved automatically and applied across the system.</p>
          </div>
        </section>
      </div>
    </section>
  );
}

function Control({ children, label, value }: { children: ReactNode; label: string; value: string }) {
  return (
    <label className={styles.control}>
      <span>
        <strong>{label}</strong>
        <em>{value}</em>
      </span>
      {children}
    </label>
  );
}
