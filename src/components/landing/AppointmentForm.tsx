"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./AppointmentForm.module.css";

const BOOKING_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1TzH5OhtrcugQsRZYOfWDvTrRiJJcOUtERndqgWYxo7weSFk58BXf7iHSWpuAkqTdrFX0oxG-S";

const availabilityOptions = [
  "Tengo el capital disponible de inmediato.",
  "Cuento con una parte y requiero esquema de financiamiento.",
  "No cuento con el enganche.",
];
type Field = "name" | "phone" | "availability";

export function AppointmentForm() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const bookingLink = useRef<HTMLAnchorElement>(null);
  const [selectedAvailability, setSelectedAvailability] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "");
    const availability = String(data.get("availability") ?? "");
    const nextErrors: Partial<Record<Field, string>> = {};
    if (!name) nextErrors.name = "Escribe tu nombre completo.";
    if (!/^[0-9]{10}$/.test(phone)) nextErrors.phone = "Escribe un número de WhatsApp de exactamente 10 dígitos.";
    if (!availabilityOptions.includes(availability)) nextErrors.availability = "Selecciona tu disponibilidad para el enganche.";
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as Field[])[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement)?.focus();
      return;
    }
    // Keep this synchronous with submission so mobile browsers retain user activation.
    // Form values remain local; Google Calendar handles the actual booking.
    bookingLink.current?.click();
  }

  return (
    <section id="appointment-form" tabIndex={-1} className={styles.section} lang="es-MX" aria-labelledby="appointment-title">
      <div className={styles.inner}>
        <h2 id="appointment-title" className={styles.heading}>Agenda tu recorrido privado al departamento muestra</h2>
        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label htmlFor="appointment-name">Nombre completo</label>
            <input id="appointment-name" name="name" type="text" autoComplete="name" placeholder="Tu nombre completo" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "appointment-name-error" : undefined} />
            {errors.name && <p id="appointment-name-error" className={styles.error}>{errors.name}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="appointment-phone">WhatsApp (10 dígitos)</label>
            <input id="appointment-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="Tu número de WhatsApp" pattern="[0-9]{10}" maxLength={10} required onChange={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, ""); }} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "appointment-phone-error" : undefined} />
            {errors.phone && <p id="appointment-phone-error" className={styles.error}>{errors.phone}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="appointment-availability">¿Cuál es tu disponibilidad actual para el enganche ($680,000)?</label>
            <div className={styles.selectWrap}>
              <span className={styles.selectedText} aria-hidden="true">{selectedAvailability || "Selecciona una opción"}</span>
              <select id="appointment-availability" name="availability" value={selectedAvailability} onChange={(event) => setSelectedAvailability(event.target.value)} required aria-invalid={Boolean(errors.availability)} aria-describedby={errors.availability ? "appointment-availability-error" : undefined}>
                <option value="" disabled>Selecciona una opción</option>
                {availabilityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            {errors.availability && <p id="appointment-availability-error" className={styles.error}>{errors.availability}</p>}
          </div>
          <button className={styles.submit} type="submit">Confirmar Cita</button>
          <a ref={bookingLink} href={BOOKING_URL} target="_blank" rel="noopener noreferrer" hidden>Google Calendar</a>
          <p className={styles.trust}>Tus datos están protegidos. Un asesor te confirmará el acceso y enviará la ubicación en Maps vía WhatsApp.</p>
        </form>
      </div>
    </section>
  );
}
