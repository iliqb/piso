import styles from "./PropertyHero.module.css";

export const BOOKING_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1TzH5OhtrcugQsRZYOfWDvTrRiJJcOUtERndqgWYxo7weSFk58BXf7iHSWpuAkqTdrFX0oxG-S";

export function AppointmentCta({
  label = "Agendar Visita al Depa Muestra",
}: { label?: string }) {
  return (
    <a className={styles.cta} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
