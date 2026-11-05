import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <img src="/brand/piso-logo.png" width={2847} height={1907} alt="Piso" />
        </div>
        <p className={styles.copyright}>© 2026 PISO</p>
      </div>
    </footer>
  );
}
