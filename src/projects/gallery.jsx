import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import "./ProjectCards.css";

const AUTOPLAY_DELAY = 5000;

function ProjectCard({ project, onOpen, lightboxOpen, isVisible }) {
  const [active, setActive] = useState(0);
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
    const timer = window.setInterval(() => setActive(index => (index + 1) % count), AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [count, isVisible, hovered, focused, hidden, reducedMotion, lightboxOpen, navigation]);

  const goTo = index => {
    setActive((index + count) % count);
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
  const [start, setStart] = useState(0);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const viewportRef = useRef(null);
  const itemRefs = useRef([]);
  const maxStart = Math.max(0, projects.length - visibleCount);
  const hasNavigation = maxStart > 0;

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

  useEffect(() => {
    setStart(current => Math.min(current, maxStart));
  }, [maxStart]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const target = itemRefs.current[Math.min(start, maxStart)];
    if (!viewport || !target) return;
    viewport.scrollTo({ left: target.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
  }, [start, maxStart, reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let previousWidth = viewport.clientWidth;
    const observer = new ResizeObserver(() => {
      if (viewport.clientWidth === previousWidth) return;
      previousWidth = viewport.clientWidth;
      viewport.scrollLeft = itemRefs.current[Math.min(start, maxStart)]?.offsetLeft ?? 0;
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [start, maxStart]);

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
      <div className="project-carousel">
        {hasNavigation && (
          <div className="project-carousel-toolbar" role="group" aria-label="Navegación entre proyectos">
            <span className="visually-hidden" aria-live="polite">
              Mostrando proyectos {start + 1} a {Math.min(start + visibleCount, projects.length)} de {projects.length}
            </span>
            <button type="button" className="project-carousel-arrow" onClick={() => setStart(current => current === 0 ? maxStart : current - 1)} aria-label="Proyectos anteriores">
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className="project-carousel-arrow" onClick={() => setStart(current => current === maxStart ? 0 : current + 1)} aria-label="Proyectos siguientes">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
        <div className="project-carousel-viewport" ref={viewportRef}>
          <div className="project-carousel-track">
            {projects.map((project, index) => {
              const isVisible = index >= start && index < start + visibleCount;
              return (
                <div
                  key={index}
                  className="project-carousel-item"
                  ref={element => { itemRefs.current[index] = element; }}
                  inert={!isVisible}
                  aria-hidden={!isVisible}
                >
                  <ProjectCard
                    project={project}
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
          openerRef.current?.focus();
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
