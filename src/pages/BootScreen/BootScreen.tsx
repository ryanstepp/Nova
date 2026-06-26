import styles from "./BootScreen.module.css";

export function BootScreen() {
  return (
    <main className={styles.bootScreen}>
      <div className={styles.mark}>
        <span />
        <strong>Nova</strong>
      </div>
      <div className={styles.loader}>
        <span />
      </div>
    </main>
  );
}
