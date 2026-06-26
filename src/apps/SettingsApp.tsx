import { useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { readImageFile } from "../core/SettingsManager/fileReaders";
import { resetPreferences, wallpaperPalettes } from "../core/SettingsManager/preferences";
import { isValidPasscode, updatePasscode } from "../core/SettingsManager/security";
import { settingCategories } from "../core/SettingsManager/settingsCatalog";
import { checkForMockUpdate, initialUpdateState } from "../core/UpdateManager/updateManager";
import type { NovaAppProps, NovaPreferences, NovaWallpaper } from "../types/nova";
import styles from "./SettingsApp.module.css";

const accentPresets = ["#5be7c4", "#6ab7ff", "#ff7ab8", "#ffd166", "#a3e635", "#f78c6b"];

export function SettingsApp({ preferences, updatePreferences }: NovaAppProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("appearance");
  const [newPasscode, setNewPasscode] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [updateState, setUpdateState] = useState(initialUpdateState);
  const activeCategory = settingCategories.find((category) => category.id === activeCategoryId) ?? settingCategories[0];

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

  function savePasscode() {
    if (!isValidPasscode(newPasscode)) {
      setSettingsMessage("Passcode must be exactly 6 numbers.");
      return;
    }

    updatePasscode(newPasscode);
    setNewPasscode("");
    setSettingsMessage("Unlock code changed.");
  }

  return (
    <section className={styles.settings}>
      <aside className={styles.sidebar}>
        {settingCategories.map((category) => (
          <button
            key={category.id}
            className={category.id === activeCategoryId ? styles.active : undefined}
            onClick={() => setActiveCategoryId(category.id)}
            type="button"
          >
            <strong>{category.name}</strong>
            <span>{category.description}</span>
          </button>
        ))}
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2>{activeCategory.name}</h2>
            <p>{activeCategory.description}</p>
          </div>
          {["appearance", "wallpaper", "home-screen", "display", "accessibility"].includes(activeCategoryId) ? (
            <button className={styles.reset} onClick={() => updatePreferences(resetPreferences())} type="button">
              <RotateCcw size={17} />
              Reset
            </button>
          ) : null}
        </header>

        {["general", "appearance", "display", "accessibility"].includes(activeCategoryId) ? renderAppearanceSettings() : null}
        {["wallpaper", "lock-screen"].includes(activeCategoryId) ? renderWallpaperSettings() : null}
        {activeCategoryId === "home-screen" ? renderHomeSettings() : null}
        {activeCategoryId === "security" || activeCategoryId === "privacy" ? renderSecuritySettings() : null}
        {activeCategoryId === "software-update" ? renderUpdateSettings() : null}
        {activeCategoryId === "about" ? renderAboutSettings() : null}
        {["notifications", "control-center", "storage", "apps", "browser"].includes(activeCategoryId) ? renderInfoSettings() : null}

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

  function renderAppearanceSettings() {
    return (
      <>
        <section className={styles.section}>
          <h3>Theme</h3>
          <div className={styles.segmented}>
            {(["dark", "light"] as const).map((theme) => (
              <button key={theme} data-active={preferences.theme === theme} onClick={() => updatePreferences({ theme })} type="button">
                {theme}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3>Accent Color</h3>
          <div className={styles.colors}>
            {accentPresets.map((color) => (
              <button key={color} aria-label={`Use ${color}`} data-active={preferences.accentColor === color} onClick={() => updatePreferences({ accentColor: color })} style={{ background: color }} type="button" />
            ))}
            <label className={styles.colorPicker}>
              <span>Custom</span>
              <input type="color" value={preferences.accentColor} onChange={(event) => updatePreferences({ accentColor: event.target.value })} />
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
      </>
    );
  }

  function renderWallpaperSettings() {
    return (
      <section className={styles.section}>
        <h3>Wallpaper</h3>
        <div className={styles.wallpapers}>
          {(Object.keys(wallpaperPalettes) as NovaWallpaper[]).map((wallpaper) => (
            <button key={wallpaper} className={styles.wallpaper} data-active={!preferences.customWallpaper && preferences.wallpaper === wallpaper} onClick={() => updatePreferences({ wallpaper, customWallpaper: null })} type="button">
              <span style={{ background: `linear-gradient(135deg, ${wallpaperPalettes[wallpaper].colors.join(", ")})` }} />
              <strong>{wallpaperPalettes[wallpaper].name}</strong>
            </button>
          ))}
        </div>
        <div className={styles.uploadRow}>
          <label className={styles.fileButton}>
            Upload wallpaper
            <input accept="image/*" type="file" onChange={(event) => void uploadWallpaper(event.target.files?.[0])} />
          </label>
          {preferences.customWallpaper ? <button onClick={() => updatePreferences({ customWallpaper: null })} type="button">Use preset</button> : null}
        </div>
      </section>
    );
  }

  function renderHomeSettings() {
    return (
      <section className={styles.section}>
        <h3>Home Screen</h3>
        <label className={styles.toggle}>
          <input checked={preferences.showWidgets} onChange={(event) => updatePreferences({ showWidgets: event.target.checked })} type="checkbox" />
          <span>Show widgets</span>
        </label>
        <label className={styles.toggle}>
          <input checked={preferences.showAppLabels} onChange={(event) => updatePreferences({ showAppLabels: event.target.checked })} type="checkbox" />
          <span>Show app labels</span>
        </label>
      </section>
    );
  }

  function renderSecuritySettings() {
    return (
      <section className={styles.section}>
        <h3>Unlock Code</h3>
        <div className={styles.passcodeRow}>
          <input inputMode="numeric" maxLength={6} placeholder="New 6 digit code" type="password" value={newPasscode} onChange={(event) => setNewPasscode(event.target.value.replace(/\D/g, "").slice(0, 6))} />
          <button onClick={savePasscode} type="button">Save code</button>
        </div>
        {settingsMessage ? <p className={styles.message}>{settingsMessage}</p> : null}
      </section>
    );
  }

  function renderUpdateSettings() {
    return (
      <section className={styles.section}>
        <h3>Software Update</h3>
        <div className={styles.infoGrid}>
          <Info label="Current version" value={updateState.currentVersion} />
          <Info label="Automatic updates" value={updateState.automaticUpdates ? "On" : "Off"} />
          <Info label="Status" value={updateState.status} />
          <Info label="Last checked" value={updateState.lastCheckedAt ? new Date(updateState.lastCheckedAt).toLocaleString() : "Never"} />
        </div>
        <div className={styles.uploadRow}>
          <button onClick={() => setUpdateState((current) => checkForMockUpdate(current))} type="button">Check for updates</button>
          <button disabled={updateState.status !== "available"} onClick={() => setUpdateState((current) => ({ ...current, status: "downloading" }))} type="button">Download</button>
          <button disabled={updateState.status !== "downloading"} onClick={() => setUpdateState((current) => ({ ...current, status: "ready" }))} type="button">Finish download</button>
          <button disabled={updateState.status !== "ready"} onClick={() => setUpdateState((current) => ({ ...current, currentVersion: current.availableVersion ?? current.currentVersion, status: "installed" }))} type="button">Install</button>
        </div>
        <ul className={styles.releaseNotes}>
          {updateState.releaseNotes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </section>
    );
  }

  function renderAboutSettings() {
    return (
      <section className={styles.section}>
        <h3>About Nova</h3>
        <div className={styles.infoGrid}>
          <Info label="Name" value="Nova" />
          <Info label="Version" value={updateState.currentVersion} />
          <Info label="Platform" value="Web + Electron-ready" />
          <Info label="Storage" value="Local browser storage" />
        </div>
      </section>
    );
  }

  function renderInfoSettings() {
    return (
      <section className={styles.section}>
        <h3>{activeCategory.name}</h3>
        <p className={styles.message}>{activeCategory.description}</p>
        <div className={styles.infoGrid}>
          <Info label="State" value="Enabled" />
          <Info label="Customization" value="Planned for deeper controls" />
        </div>
      </section>
    );
  }
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <article className={styles.infoCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
