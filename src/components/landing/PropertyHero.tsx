import { AppointmentCta } from "./AppointmentCta";
import styles from "./PropertyHero.module.css";

export function PropertyHero() {
  return (
    <section className={styles.introduction} lang="es-MX" aria-labelledby="property-introduction">
      <div className={styles.inner}>
        <h2 id="property-introduction" className={styles.title}>
          Visita nuestro departamento muestra y comprueba la calidad de acabados y distribución en vivo.
        </h2>
        <div className={styles.mosaic}>
          <figure className="content-image-frame content-image-shadow">
            <img src="/introduccion/recamara-principal.jpg" alt="Recámara principal con balcón" loading="lazy" />
            <figcaption>Recámara principal</figcaption>
          </figure>
          <figure className="content-image-frame content-image-shadow">
            <img src="/introduccion/terraza-rooftop.png" alt="Terraza con pérgola de madera y zona de descanso" loading="lazy" />
            <figcaption>Terraza rooftop</figcaption>
          </figure>
          <figure className="content-image-frame content-image-shadow">
            <img src="/introduccion/sala-cocina-comedor.jpg" alt="Sala, cocina y comedor del departamento" loading="lazy" />
            <figcaption>Sala y cocina</figcaption>
          </figure>
        </div>
        <ul className={styles.highlights} aria-label="Características del desarrollo">
          <li><h3>89 m² habitables</h3><p>con 3 recámaras</p></li>
          <li><h3>Elevador</h3><p>y estacionamiento subterráneo</p></li>
          <li><h3>Rooftop comunal</h3><p>con asadores</p></li>
        </ul>
        <AppointmentCta />
      </div>
    </section>
  );
}
