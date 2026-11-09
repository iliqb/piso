import styles from "./AppointmentForm.module.css";

import { BOOKING_URL } from "./AppointmentCta";

export function AppointmentForm() {
  return (
    <section id="appointment-form" tabIndex={-1} className={styles.section} lang="es-MX" aria-label="Agenda tu visita">
      <div className={styles.inner}>

        <a className={styles.submit} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Agenda Vista al Depa Muestra</a>
      </div>
    </section>
  );
}
