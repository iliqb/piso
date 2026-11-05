"use client";

import { useEffect, useState } from "react";
import styles from "./PropertyHero.module.css";

const APPOINTMENT_TARGET_ID = "appointment-form";

export function AppointmentCta({
  label = "Agendar Visita al Depa Muestra",
}: { label?: string }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(Boolean(document.getElementById(APPOINTMENT_TARGET_ID)));
  }, []);

  function goToAppointment() {
    const target = document.getElementById(APPOINTMENT_TARGET_ID);
    if (!target) {
      setAvailable(false);
      return;
    }
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
    target.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      className={styles.cta}
      onClick={goToAppointment}
      disabled={!available}
    >
      {label}
    </button>
  );
}
