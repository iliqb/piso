import styles from "./LandingSections.module.css";

type ImagePlaceholderProps = {
  identifier: string;
  label: string;
  aspect?: "portrait" | "landscape" | "plan";
};

// Replace the placeholder surface with an image when assets are supplied;
// keep the aspect-ratio wrapper to reserve its layout space.
export function ImagePlaceholder({ identifier, label, aspect = "landscape" }: ImagePlaceholderProps) {
  return (
    <div className={`${styles.placeholder} ${styles[aspect]}`} data-image-placeholder={identifier}
      role="img" aria-label={`${label}. Imagen pendiente. Referencia: ${identifier}.`}>
      <span className={styles.placeholderId} aria-hidden="true">{identifier}</span>
      <div className={styles.placeholderLabel} aria-hidden="true">
        <span>{label}</span>
        <span className={styles.placeholderNote}>Imagen pendiente</span>
      </div>
    </div>
  );
}
