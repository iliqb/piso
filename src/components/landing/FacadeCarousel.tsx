"use client";

import { useRef, useState } from "react";
import styles from "./FacadeCarousel.module.css";

const facades = [
  { src: "/fachadas/derecha.png", alt: "Vista derecha de la fachada de Piso Zen" },
  { src: "/fachadas/izquierda.png", alt: "Vista izquierda de la fachada de Piso Zen" },
];

export function FacadeCarousel() {
  return <ImageCarousel images={facades} label="Vistas de la fachada" width={1672} height={941} />;
}

export function FloorPlanCarousel() {
  return (
    <ImageCarousel
      images={[
        { src: "/planos/departamento-c.png", alt: "Plano amueblado del departamento C" },
        { src: "/planos/departamento-b.png", alt: "Plano amueblado del departamento B" },
        { src: "/planos/departamento-a2.png", alt: "Plano amueblado del departamento A2" },
      ]}
      label="Planos de los departamentos"
      width={3014}
      height={3014}
      square
    />
  );
}

type ImageCarouselProps = {
  images: { src: string; alt: string }[];
  label: string;
  width: number;
  height: number;
  square?: boolean;
};

function ImageCarousel({ images, label, width, height, square = false }: ImageCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const viewport = track.current;
    if (viewport && index >= 0 && index < images.length) {
      viewport.scrollTo({ left: index * viewport.clientWidth });
    }
  }

  return (
    <div className={`${styles.carousel} content-image-shadow`} role="group" aria-label={label}>
      <div
        ref={track}
        className={square ? `${styles.track} ${styles.square}` : styles.track}
        onScroll={({ currentTarget }) => {
          if (currentTarget.clientWidth > 0) {
            setActive(Math.round(currentTarget.scrollLeft / currentTarget.clientWidth));
          }
        }}
      >
        {images.map(({ src, alt }) => (
          <div key={src} className={`${styles.slide} content-image-frame`}>
            <img src={src} alt={alt} width={width} height={height} loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
      <button type="button" className={`${styles.arrow} ${styles.previous}`}
        aria-label="Imagen anterior" aria-disabled={active === 0} onClick={() => goTo(active - 1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
      </button>
      <button type="button" className={`${styles.arrow} ${styles.next}`}
        aria-label="Imagen siguiente" aria-disabled={active === images.length - 1} onClick={() => goTo(active + 1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
      </button>
    </div>
  );
}
