"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PaymentPlan.module.css";

const steps = [
  {
    title: "Apartado inicial",
    detail: "$50,000 MXN",
    description: "Congela el precio de preventa y asegura la ubicación de tu departamento.",
  },
  {
    title: "Enganche del 20%",
    description: "A la firma del contrato de compraventa.",
  },
  {
    title: "Durante obra",
    detail: "Mensualidades fijas de $25,000 MXN",
    description: "Abonos directos a capital hasta la entrega de tu unidad en Diciembre 2027.",
  },
  {
    title: "Saldo a la entrega",
    detail: "Contra escrituración",
    description: "Liquidación mediante crédito Bancario, Infonavit, Fovissste o recursos propios.",
  },
];

export function PaymentPlan() {
  const section = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const root = section.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={section} className={styles.section} data-entered={entered} lang="es-MX" aria-labelledby="payment-plan-title">
      <div className={styles.inner}>
        <h2 id="payment-plan-title" className={styles.heading}>Esquema de pagos</h2>
        <ol className={styles.timeline} role="list">
          {steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.milestone} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.content}>
                <h3 className={styles.title}>{step.title}</h3>
                {step.detail && <p className={styles.detail}>{step.detail}</p>}
                <p className={styles.description}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
