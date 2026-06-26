import { useState } from "react";
import type { NovaNotification } from "../../types/nova";
import styles from "./LockScreen.module.css";

interface LockScreenProps {
  date: Date;
  notifications: NovaNotification[];
  onUnlock: (passcode: string) => boolean;
}

export function LockScreen({ date, notifications, onUnlock }: LockScreenProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  function addDigit(digit: string) {
    setError("");
    setPasscode((current) => `${current}${digit}`.slice(0, 6));
  }

  function submitUnlock(nextPasscode = passcode) {
    if (nextPasscode.length !== 6) {
      setError("Enter your 6 digit code.");
      return;
    }

    if (onUnlock(nextPasscode)) {
      setPasscode("");
      return;
    }

    setError("That code did not unlock Nova.");
    setPasscode("");
  }

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
      <section className={styles.unlockPanel} aria-label="Unlock Nova">
        <div className={styles.dots}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} data-filled={index < passcode.length} />
          ))}
        </div>
        <div className={styles.keypad}>
          {"123456789".split("").map((digit) => (
            <button key={digit} onClick={() => addDigit(digit)} type="button">{digit}</button>
          ))}
          <button onClick={() => setPasscode((current) => current.slice(0, -1))} type="button">Del</button>
          <button onClick={() => addDigit("0")} type="button">0</button>
          <button onClick={() => submitUnlock()} type="button">Go</button>
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
      </section>
    </main>
  );
}
