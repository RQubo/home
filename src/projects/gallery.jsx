import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import AccordionGallery from "./AccordionGallery.jsx";

function ProjectGallery({ items }) {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

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
      <AccordionGallery
        items={items}
        defaultIndex={0}
        accentColor="#ffffff"
        overlayColor="#071342"
        expandRatio={0.78}
        height={460}
        gap={12}
        radius={18}
        duration={0.6}
        parallax={0.5}
        tilt={8}
        className="projects-accordion"
        onSelect={(item, opener) => {
          openerRef.current = opener;
          setSelected(item);
        }}
      />
      <dialog
        ref={dialogRef}
        className="project-lightbox"
        aria-labelledby="project-lightbox-title"
        onClose={() => {
          setSelected(null);
          openerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            dialogRef.current.querySelector("button")?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current.close();
        }}
      >
        {selected && (
          <div className="project-lightbox-content">
            <div className="project-lightbox-header">
              <h3 id="project-lightbox-title">{selected.label}</h3>
              <button className="project-lightbox-close" type="button" aria-label="Cerrar imagen" autoFocus onClick={() => dialogRef.current.close()}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <img src={selected.image} alt={selected.alt} className="project-lightbox-image" />
          </div>
        )}
      </dialog>
    </>
  );
}

// Los proyectos se editan en el HTML; los enlaces también funcionan sin JavaScript.
const root = document.getElementById("projects-gallery");
if (root) {
  const items = [...root.querySelectorAll("a[data-project]")].map((link) => ({
    image: link.querySelector("img").getAttribute("src"),
    alt: link.querySelector("img").alt,
    label: link.dataset.project,
    link: link.getAttribute("href")
  }));
  if (items.length) {
    createRoot(root).render(
      <ProjectGallery items={items} />
    );
  }
}
