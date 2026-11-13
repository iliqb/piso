
import { FacadeCarousel, FloorPlanCarousel } from "./FacadeCarousel";
import styles from "./LandingSections.module.css";
import heroStyles from "./PropertyHero.module.css";

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
              <a
                className={`${heroStyles.cta} ${styles.locationButton}`}
                href="https://maps.app.goo.gl/uCbGLuPnEuwb8MaZ7"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="lucide lucide-map-pin" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Ubicación
              </a>
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

          </div>
          <FloorPlanCarousel />
        </section>
      </div>
    </section>
  );
}
