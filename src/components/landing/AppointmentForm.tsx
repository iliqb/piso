import styles from "./AppointmentForm.module.css";

const BOOKING_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1TzH5OhtrcugQsRZYOfWDvTrRiJJcOUtERndqgWYxo7weSFk58BXf7iHSWpuAkqTdrFX0oxG-S";

export function AppointmentForm() {
  return (
    <section id="appointment-form" tabIndex={-1} className={styles.section} lang="es-MX" aria-labelledby="appointment-title">
      <div className={styles.inner}>
        <h2 id="appointment-title" className={styles.heading}>Agenda tu recorrido privado al departamento muestra</h2>
        <a className={styles.submit} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Confirmar cita</a>
      </div>
    </section>
  );
}
