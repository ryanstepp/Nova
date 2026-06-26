import { useState } from "react";
import { Check, Image, LockKeyhole, Palette } from "lucide-react";
import { readImageFile } from "../../core/SettingsManager/fileReaders";
import { completeSetup, isValidPasscode } from "../../core/SettingsManager/security";
import { wallpaperPalettes } from "../../core/SettingsManager/preferences";
import type { NovaPreferences, NovaWallpaper } from "../../types/nova";
import styles from "./SetupWizard.module.css";

interface SetupWizardProps {
  preferences: NovaPreferences;
  updatePreferences: (preferences: Partial<NovaPreferences>) => void;
  onComplete: () => void;
}

const accentPresets = ["#5be7c4", "#6ab7ff", "#ff7ab8", "#ffd166", "#a3e635"];

export function SetupWizard({ preferences, updatePreferences, onComplete }: SetupWizardProps) {
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");

  async function uploadWallpaper(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      updatePreferences({ customWallpaper: await readImageFile(file) });
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "Could not upload wallpaper.");
    }
  }

  function finishSetup() {
    if (!isValidPasscode(passcode)) {
      setError("Use exactly 6 numbers for your unlock code.");
      return;
    }

    if (passcode !== confirmPasscode) {
      setError("Both passcodes need to match.");
      return;
    }

    completeSetup(passcode);
    onComplete();
  }

  return (
    <main className={styles.setup}>
      <section className={styles.panel}>
        <header className={styles.header}>
          <span>Nova</span>
          <h1>Set up your desktop</h1>
          <p>Choose the basics now. You can change everything later in Settings.</p>
        </header>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2><LockKeyhole size={20} /> Unlock code</h2>
            <div className={styles.passcode}>
              <input
                inputMode="numeric"
                maxLength={6}
                placeholder="6 digit code"
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <input
                inputMode="numeric"
                maxLength={6}
                placeholder="Confirm code"
                type="password"
                value={confirmPasscode}
                onChange={(event) => setConfirmPasscode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
          </section>

          <section className={styles.card}>
            <h2><Palette size={20} /> Appearance</h2>
            <div className={styles.segmented}>
              {(["dark", "light"] as const).map((theme) => (
                <button key={theme} data-active={preferences.theme === theme} onClick={() => updatePreferences({ theme })} type="button">
                  {theme}
                </button>
              ))}
            </div>
            <div className={styles.colors}>
              {accentPresets.map((accentColor) => (
                <button
                  key={accentColor}
                  aria-label={`Use ${accentColor}`}
                  data-active={preferences.accentColor === accentColor}
                  onClick={() => updatePreferences({ accentColor })}
                  style={{ background: accentColor }}
                  type="button"
                />
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2><Image size={20} /> Wallpaper</h2>
            <div className={styles.wallpapers}>
              {(Object.keys(wallpaperPalettes) as NovaWallpaper[]).map((wallpaper) => (
                <button
                  key={wallpaper}
                  data-active={!preferences.customWallpaper && preferences.wallpaper === wallpaper}
                  onClick={() => updatePreferences({ wallpaper, customWallpaper: null })}
                  type="button"
                >
                  <span style={{ background: `linear-gradient(135deg, ${wallpaperPalettes[wallpaper].colors.join(", ")})` }} />
                  {wallpaperPalettes[wallpaper].name}
                </button>
              ))}
            </div>
            <label className={styles.upload}>
              Upload wallpaper
              <input accept="image/*" type="file" onChange={(event) => void uploadWallpaper(event.target.files?.[0])} />
            </label>
          </section>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.finish} onClick={finishSetup} type="button">
          <Check size={18} />
          Finish setup
        </button>
      </section>
    </main>
  );
}
