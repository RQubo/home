import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./ProjectCards.css";

const AUTOPLAY_DELAY = 5000;
const SLIDE_DURATION = 650;
const CAROUSEL_SPEED = 32; // Píxeles por segundo, independientemente del ancho de pantalla.

function ProjectCard({ project, projectIndex, active, onImageChange, onOpen, lightboxOpen, isVisible }) {
  const [navigation, setNavigation] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const count = project.images.length;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (count < 2 || !isVisible || hovered || focused || hidden || reducedMotion || lightboxOpen) return;
    const timer = window.setInterval(() => onImageChange(projectIndex, index => (index + 1) % count), AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [count, isVisible, hovered, focused, hidden, reducedMotion, lightboxOpen, navigation, onImageChange, projectIndex]);

  const goTo = index => {
    onImageChange(projectIndex, (index + count) % count);
    setNavigation(value => value + 1);
  };

  const image = project.images[active];

  return (
    <article
      className="project-showcase-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={event => setFocused(event.target.matches(":focus-visible"))}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className={`project-showcase-media${count > 1 ? " has-carousel" : ""}`}>
        <button
          className="project-showcase-image-button"
          type="button"
          onClick={event => onOpen(image, project.title, event.currentTarget)}
          aria-label={`Ampliar imagen ${active + 1} de ${count} de ${project.title}`}
          aria-haspopup="dialog"
        >
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
        </button>
        {count > 1 && (
          <div className="project-showcase-controls" role="group" aria-label={`Imágenes de ${project.title}`}>
            <button type="button" className="project-showcase-arrow" onClick={() => goTo(active - 1)} aria-label={`Imagen anterior de ${project.title}`}>
              <span aria-hidden="true">‹</span>
            </button>
            <div className="project-showcase-dots">
              {project.images.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  className={`project-showcase-dot${index === active ? " is-active" : ""}`}
                  onClick={() => goTo(index)}
                  aria-label={`Mostrar imagen ${index + 1} de ${project.title}`}
                  aria-current={index === active ? "true" : undefined}
                />
              ))}
            </div>
            <button type="button" className="project-showcase-arrow" onClick={() => goTo(active + 1)} aria-label={`Imagen siguiente de ${project.title}`}>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </div>
      <div className="project-showcase-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </article>
  );
}

function ProjectGallery({ projects }) {
  const [selected, setSelected] = useState(null);
  const [visibleCount, setVisibleCount] = useState(
    () => window.matchMedia("(max-width: 767px)").matches ? 1 : 2
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  // Tres copias permiten atravesar ambos extremos y recolocar el track sin un salto visible.
  const count = projects.length;
  const [position, setPosition] = useState(count);
  const [step, setStep] = useState(0);
  const [moving, setMoving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [inView, setInView] = useState(false);
  const [activeImages, setActiveImages] = useState(() => projects.map(() => 0));
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const movingRef = useRef(false);
  const hasNavigation = count > visibleCount;
  const start = Math.floor(((position - count) % count + count) % count);
  const slides = hasNavigation ? [...projects, ...projects, ...projects] : projects;
  const offset = hasNavigation ? position : 0;
  const canAutoplay = hasNavigation && inView && !hovered && !focused && !hidden && !selected && !reducedMotion;

  // Las copias de un mismo proyecto comparten la imagen activa al cruzar un extremo.
  const onImageChange = useCallback((index, update) => {
    setActiveImages(current => current.map((active, projectIndex) =>
      projectIndex === index ? (typeof update === "function" ? update(active) : update) : active
    ));
  }, []);

  const finishMove = useCallback(() => {
    if (!movingRef.current) return;
    movingRef.current = false;
    setMoving(false);
    setPosition(current => count + ((current - count) % count + count) % count);
  }, [count]);

  const move = useCallback(direction => {
    if (!hasNavigation || movingRef.current) return;
    if (reducedMotion) {
      setPosition(current => count + ((Math.floor(current - count) + direction) % count + count) % count);
      return;
    }
    movingRef.current = true;
    setMoving(true);
    setPosition(current => Math.floor(current) + direction);
  }, [count, hasNavigation, reducedMotion]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 767px)");
    const update = () => setVisibleCount(breakpoint.matches ? 1 : 2);
    breakpoint.addEventListener("change", update);
    return () => breakpoint.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const update = () => {
      finishMove();
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setStep(track.firstElementChild.getBoundingClientRect().width + gap);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [visibleCount, finishMove]);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(viewportRef.current);
    return () => {
      document.removeEventListener("visibilitychange", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!moving) return;
    if (reducedMotion) { finishMove(); return; }
    // Respaldo por si se cancela la transición o la pestaña pasa a segundo plano.
    const timer = window.setTimeout(finishMove, SLIDE_DURATION + 100);
    return () => window.clearTimeout(timer);
  }, [moving, reducedMotion, finishMove]);

  useEffect(() => {
    if (!canAutoplay || moving || !step) return;
    let frame;
    let previousTime;
    const tick = time => {
      if (previousTime !== undefined) {
        // Limitar el delta evita saltos si el navegador tarda en entregar un frame.
        const distance = CAROUSEL_SPEED * Math.min(time - previousTime, 50) / 1000 / step;
        setPosition(current => count + ((current - count + distance) % count + count) % count);
      }
      previousTime = time;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [canAutoplay, moving, step, count]);

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [selected]);

  return (
    <>
      <div
        className="project-carousel"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos en acción"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {hasNavigation && (
          <div className="project-carousel-toolbar" role="group" aria-label="Navegación entre proyectos">
            <span className="visually-hidden" aria-live={canAutoplay ? "off" : "polite"} aria-atomic="true">
              Proyectos visibles: {Array.from({ length: Math.min(visibleCount, count) }, (_, index) => projects[(start + index) % count].title).join(", ")}.
            </span>
            <button type="button" className="project-carousel-arrow" onClick={() => move(-1)} aria-label="Proyectos anteriores">
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className="project-carousel-arrow" onClick={() => move(1)} aria-label="Proyectos siguientes">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
        <div className="project-carousel-viewport" ref={viewportRef}>
          <div
            ref={trackRef}
            className={`project-carousel-track${moving ? " is-moving" : ""}`}
            style={{ transform: `translate3d(${-offset * step}px, 0, 0)`, "--slide-duration": `${SLIDE_DURATION}ms` }}
            onTransitionEnd={event => {
              if (event.target === event.currentTarget && event.propertyName === "transform") finishMove();
            }}
          >
            {slides.map((project, index) => {
              const projectIndex = index % count;
              const isVisible = index + 1 > offset && index < offset + visibleCount;
              return (
                <div
                  key={index}
                  className="project-carousel-item"
                  data-project-index={projectIndex}
                  inert={!isVisible}
                  aria-hidden={!isVisible}
                >
                  <ProjectCard
                    project={project}
                    projectIndex={projectIndex}
                    active={activeImages[projectIndex]}
                    onImageChange={onImageChange}
                    isVisible={isVisible}
                    lightboxOpen={Boolean(selected)}
                    onOpen={(image, title, opener) => {
                      openerRef.current = opener;
                      setSelected({ ...image, title });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="project-lightbox"
        aria-labelledby="project-lightbox-title"
        onClose={() => {
          setSelected(null);
          const opener = openerRef.current;
          const item = opener?.closest(".project-carousel-item");
          // Si se abrió durante el cruce de un extremo, el foco vuelve a la copia visible.
          const visibleOpener = item?.inert
            ? trackRef.current.querySelector(`.project-carousel-item:not([inert])[data-project-index="${item.dataset.projectIndex}"] .project-showcase-image-button`)
            : opener;
          visibleOpener?.focus();
        }}
        onClick={event => {
          if (event.target === event.currentTarget) dialogRef.current.close();
        }}
      >
        {selected && (
          <div className="project-lightbox-content">
            <div className="project-lightbox-header">
              <h3 id="project-lightbox-title">{selected.title}</h3>
              <button className="project-lightbox-close" type="button" aria-label="Cerrar imagen" autoFocus onClick={() => dialogRef.current.close()}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <img src={selected.src} alt={selected.alt} className="project-lightbox-image" />
          </div>
        )}
      </dialog>
    </>
  );
}

// Los proyectos se editan en el HTML y siguen siendo visibles sin JavaScript.
const root = document.getElementById("projects-gallery");
if (root) {
  const projects = [...root.querySelectorAll("[data-project]")].map(card => ({
    title: card.querySelector("h3").textContent.trim(),
    description: card.querySelector("p").textContent.trim(),
    images: [...card.querySelectorAll(".project-showcase-media a")].map(link => ({
      src: link.querySelector("img").getAttribute("src"),
      alt: link.querySelector("img").alt
    }))
  }));
  if (projects.length) {
    root.classList.add("is-enhanced");
    createRoot(root).render(<ProjectGallery projects={projects} />);
  }
}
