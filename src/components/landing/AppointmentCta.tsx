"use client";

import { useEffect, useState } from "react";
import styles from "./PropertyHero.module.css";

// Give the future appointment section this ID and tabIndex={-1}.
const APPOINTMENT_TARGET_ID = "appointment-form";
const PRIMARY_CTA_ID = "primary-appointment-cta";

export function AppointmentCta({
  label = "Agendar Visita al Depa Muestra",
  returnToPrimary = false,
}: { label?: string; returnToPrimary?: boolean }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (returnToPrimary) return;
    setAvailable(Boolean(document.getElementById(APPOINTMENT_TARGET_ID)));
  }, [returnToPrimary]);

  function goToAppointment() {
    const target = document.getElementById(returnToPrimary ? PRIMARY_CTA_ID : APPOINTMENT_TARGET_ID);
    if (!target) {
      setAvailable(false);
      return;
    }
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: returnToPrimary ? "center" : "start",
    });
    target.focus({ preventScroll: true });
  }

  return (
    <button
      id={returnToPrimary ? undefined : PRIMARY_CTA_ID}
      type="button"
      className={styles.cta}
      onClick={goToAppointment}
      disabled={!returnToPrimary && !available}
    >
      {label}
    </button>
  );
}
