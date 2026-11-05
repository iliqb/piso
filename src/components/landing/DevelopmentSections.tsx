import { AppointmentCta } from "./AppointmentCta";
import { FacadeCarousel, FloorPlanCarousel } from "./FacadeCarousel";
import styles from "./LandingSections.module.css";

export function DevelopmentSections() {
  return (
    <section className={styles.development} lang="es-MX" aria-label="Desarrollo residencial boutique">
      <div className={styles.container}>
        <section className={`${styles.split} ${styles.boutique} ${styles.reveal}`} aria-labelledby="boutique-title">
          <div className={styles.copy}>
            <h2 id="boutique-title" className={styles.exclusiveTitle}>
              <span>Solo</span> <span className={styles.number}>12</span> <span>Departamentos</span>
            </h2>
            <p className={styles.body}>Zen está concebido como una torre boutique, brindando privacidad, seguridad y bajo costo de mantenimiento a largo plazo.</p>
            <div className={styles.location}>
              <h3 id="location-title" className={styles.locationHeading}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Ubicación Privilegiada
              </h3>
              <address className={styles.address}>Calle cerrada Francisco Sarabia, San Juanito, Texcoco</address>
              <p className={styles.body}>A pasos caminando de Gran Patio Texcoco (supermercados, bancos, cines) y conexión rápida a vías hacia CDMX.</p>
            </div>
          </div>
          <FacadeCarousel />
        </section>

        <section className={`${styles.split} ${styles.layout} ${styles.reveal}`} aria-labelledby="layout-title">
          <div className={styles.copy}>
            <h2 id="layout-title" className={styles.heading}>Distribución inteligente en 89 m²</h2>
            <ul className={styles.details}>
              <li>Sala y comedor, cocina integral abierta con barra de granito y área de lavado independiente.</li>
              <li>Recámara principal con vestidor/baño completo + 2 recámaras secundarias con clóset y baño completo compartido.</li>
              <li>1 Cajón de estacionamiento asignado en sótano.</li>
            </ul>
            <AppointmentCta label="Conocer Tipologías" returnToPrimary />
          </div>
          <FloorPlanCarousel />
        </section>
      </div>
    </section>
  );
}
