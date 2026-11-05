import { AppointmentCta } from "./AppointmentCta";
import { ImagePlaceholder } from "./ImagePlaceholder";
import styles from "./LandingSections.module.css";

const amenities = [
  { id: "ZEN-04", text: "Rooftop Comunal con zona de asadores", image: "/amenidades/rooftop.png", alt: "Terraza con pérgola, asador y comedor", position: "center" },
  { id: "ZEN-05", text: "Jardín con zona de juegos infantiles", image: "/amenidades/jardin.png", alt: "Jardín con área de juegos infantiles", position: "center 57%" },
  { id: "ZEN-06", text: "Elevador", image: null, placeholder: "Amenidad · Elevador" },
  { id: "ZEN-07", text: "Acceso controlado", image: null, placeholder: "Amenidad · Acceso al desarrollo" },
];

export function AmenitiesAndModel() {
  return (
    <section className={styles.experience} lang="es-MX" aria-label="Amenidades y departamento muestra">
      <div className={styles.container}>
        <section className={styles.amenities} aria-labelledby="amenities-title">
          <h2 id="amenities-title" className={`${styles.heading} ${styles.reveal}`}>Amenidades</h2>
          <ul className={styles.amenitiesGrid}>
            {amenities.map((amenity) => (
              <li key={amenity.id} className={`${styles.amenity} ${styles.reveal}`}>
                {amenity.image ? (
                  <div className="content-image-frame">
                    <img className={styles.amenityImage} src={amenity.image} alt={amenity.alt}
                      style={{ objectPosition: amenity.position }} loading="lazy" />
                  </div>
                ) : (
                  <ImagePlaceholder identifier={amenity.id} label={amenity.placeholder ?? amenity.text} />
                )}
                <h3 className={styles.amenityTitle}>{amenity.text}</h3>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${styles.model} ${styles.reveal}`} aria-labelledby="model-title">
          <div className={styles.copy}>
            <h2 id="model-title" className={styles.heading}>Conoce el departamento muestra</h2>
            <p className={styles.body}>En preventa, el mayor riesgo suele ser la duda sobre cómo quedará terminado. Por eso, te invitamos a recorrer las instalaciones de nuestro proyecto terminado contiguo:</p>
            <ul className={styles.details}>
              <li>Camina un departamento idéntico en distribución y carpintería.</li>
              <li>Comprueba en persona la cancelería, iluminación y calidad de obra.</li>
            </ul>
            <AppointmentCta label="Agendar Recorrido al Depa Muestra" returnToPrimary />
          </div>
        </section>
      </div>
    </section>
  );
}
