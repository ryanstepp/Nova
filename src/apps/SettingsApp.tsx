import { useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { readImageFile } from "../core/SettingsManager/fileReaders";
import { resetPreferences, wallpaperPalettes } from "../core/SettingsManager/preferences";
import { isValidPasscode, updatePasscode } from "../core/SettingsManager/security";
import { settingCategories } from "../core/SettingsManager/settingsCatalog";
import type { NovaAppProps, NovaPreferences, NovaWallpaper } from "../types/nova";
import styles from "./SettingsApp.module.css";

const accentPresets = ["#5be7c4", "#6ab7ff", "#ff7ab8", "#ffd166", "#a3e635", "#f78c6b"];
const ownerIconCode = import.meta.env.VITE_NOVA_OWNER_CODE ?? "nova-owner-2026";
const customizableApps = [
  { id: "files", name: "Files" },
  { id: "browser", name: "Browser" },
  { id: "notes", name: "Notes" },
  { id: "calculator", name: "Calculator" },
  { id: "calendar", name: "Calendar" },
  { id: "music", name: "Music" },
  { id: "gallery", name: "Gallery" },
  { id: "clock", name: "Clock" },
  { id: "camera", name: "Camera" },
  { id: "settings", name: "Settings" }
];

export function SettingsApp({ preferences, updatePreferences }: NovaAppProps) {
  const [newPasscode, setNewPasscode] = useState("");
  const [ownerCode, setOwnerCode] = useState("");
  const [hasOwnerIconAccess, setHasOwnerIconAccess] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  function updateNumber(key: keyof NovaPreferences, value: string) {
    updatePreferences({ [key]: Number(value) } as Partial<NovaPreferences>);
  }

  async function uploadWallpaper(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      updatePreferences({ customWallpaper: await readImageFile(file) });
      setSettingsMessage("Wallpaper updated.");
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : "Could not upload wallpaper.");
    }
  }

  async function uploadAppIcon(appId: string, file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const icon = await readImageFile(file);
      updatePreferences({ appIcons: { ...preferences.appIcons, [appId]: icon } });
      setSettingsMessage("App icon updated.");
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : "Could not upload icon.");
    }
  }

  function removeAppIcon(appId: string) {
    const nextIcons = { ...preferences.appIcons };
    delete nextIcons[appId];
    updatePreferences({ appIcons: nextIcons });
  }

  function savePasscode() {
    if (!isValidPasscode(newPasscode)) {
      setSettingsMessage("Passcode must be exactly 6 numbers.");
      return;
    }

    updatePasscode(newPasscode);
    setNewPasscode("");
    setSettingsMessage("Unlock code changed.");
  }

  function unlockOwnerIconTools() {
    if (ownerCode === ownerIconCode) {
      setHasOwnerIconAccess(true);
      setOwnerCode("");
      setSettingsMessage("Owner icon tools unlocked.");
      return;
    }

    setSettingsMessage("That owner code is not correct.");
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
          <div className={styles.uploadRow}>
            <label className={styles.fileButton}>
              Upload wallpaper
              <input accept="image/*" type="file" onChange={(event) => void uploadWallpaper(event.target.files?.[0])} />
            </label>
            {preferences.customWallpaper ? (
              <button onClick={() => updatePreferences({ customWallpaper: null })} type="button">Use preset</button>
            ) : null}
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
          <label className={styles.toggle}>
            <input
              checked={preferences.showAppLabels}
              onChange={(event) => updatePreferences({ showAppLabels: event.target.checked })}
              type="checkbox"
            />
            <span>Show app labels</span>
          </label>
        </section>

        <section className={styles.section}>
          <h3>App Icons</h3>
          {hasOwnerIconAccess ? (
            <div className={styles.iconGrid}>
              {customizableApps.map((currentApp) => (
                <article key={currentApp.id} className={styles.iconEditor}>
                  <span>
                    {preferences.appIcons[currentApp.id] ? <img src={preferences.appIcons[currentApp.id]} alt="" /> : currentApp.name.slice(0, 1)}
                  </span>
                  <strong>{currentApp.name}</strong>
                  <label className={styles.fileButton}>
                    Upload
                    <input accept="image/*" type="file" onChange={(event) => void uploadAppIcon(currentApp.id, event.target.files?.[0])} />
                  </label>
                  {preferences.appIcons[currentApp.id] ? (
                    <button onClick={() => removeAppIcon(currentApp.id)} type="button">Remove</button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.ownerLock}>
              <p>App icon photos are owner-only.</p>
              <div className={styles.passcodeRow}>
                <input
                  placeholder="Owner icon code"
                  type="password"
                  value={ownerCode}
                  onChange={(event) => setOwnerCode(event.target.value)}
                />
                <button onClick={unlockOwnerIconTools} type="button">Unlock</button>
              </div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3>Security</h3>
          <div className={styles.passcodeRow}>
            <input
              inputMode="numeric"
              maxLength={6}
              placeholder="New 6 digit code"
              type="password"
              value={newPasscode}
              onChange={(event) => setNewPasscode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <button onClick={savePasscode} type="button">Save code</button>
          </div>
          {settingsMessage ? <p className={styles.message}>{settingsMessage}</p> : null}
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
