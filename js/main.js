"use strict";

// Configurá aquí los canales de contacto. Los vacíos se muestran como pendientes.
const RQUBO_CONTACT = Object.freeze({
  email: "rqubosoftware@gmail.com",
  whatsapp: "", // Formato internacional: solo dígitos, sin + ni espacios.
  linkedin: "" // URL completa del perfil o página de RQubo.
});

(() => {
  document.documentElement.classList.add("js-ready");
  const header = document.getElementById("site-header");
  const menu = document.getElementById("main-nav");
  const toggle = document.querySelector(".navbar-toggler");
  const year = document.querySelector("[data-year]");
  const emailAddress = document.querySelector("[data-contact-email]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (year) year.textContent = new Date().getFullYear();

  const refreshHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 15);
  refreshHeader();
  window.addEventListener("scroll", refreshHeader, { passive: true });

  const closeMenu = () => {
    if (menu?.classList.contains("show") && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  };

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("show")) {
      closeMenu();
      toggle?.focus();
    }
  });
  menu?.addEventListener("shown.bs.collapse", () => toggle?.setAttribute("aria-label", "Cerrar navegación"));
  menu?.addEventListener("hidden.bs.collapse", () => toggle?.setAttribute("aria-label", "Abrir navegación"));

  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.documentElement.classList.add("motion-ready");
    revealElements.forEach((element) => revealObserver.observe(element));
    prefersReducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        document.documentElement.classList.remove("motion-ready");
        revealObserver.disconnect();
      }
    });
  }

  // La navegación activa usa secciones reales; no modifica el historial.
  if ("IntersectionObserver" in window) {
    const navLinks = [...menu.querySelectorAll('.nav-link[href^="#"]')];
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach((section) => sectionObserver.observe(section));
  }

  if (emailAddress) {
    emailAddress.textContent = RQUBO_CONTACT.email;
    emailAddress.href = `mailto:${RQUBO_CONTACT.email}`;
  }
  document.querySelectorAll("[data-contact-mailto]").forEach((link) => {
    link.href = `mailto:${RQUBO_CONTACT.email}`;
  });

  const whatsapp = document.querySelector("[data-contact-whatsapp]");
  if (/^\d{8,15}$/.test(RQUBO_CONTACT.whatsapp)) {
    const message = encodeURIComponent("Hola RQubo, quiero conversar sobre un proyecto.");
    whatsapp.href = `https://wa.me/${RQUBO_CONTACT.whatsapp}?text=${message}`;
    whatsapp.hidden = false;
    document.querySelector("[data-whatsapp-pending]").hidden = true;
  }
  if (RQUBO_CONTACT.linkedin) {
    try {
      const linkedinUrl = new URL(RQUBO_CONTACT.linkedin);
      if (linkedinUrl.protocol === "https:" && /(^|\.)linkedin\.com$/.test(linkedinUrl.hostname)) {
        const linkedin = document.querySelector("[data-contact-linkedin]");
        linkedin.href = linkedinUrl.href;
        linkedin.hidden = false;
        document.querySelector("[data-linkedin-pending]").hidden = true;
      }
    } catch { /* Un canal incompleto conserva su estado pendiente. */ }
  }

  document.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
    const feedback = document.getElementById("copy-feedback");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(RQUBO_CONTACT.email);
      feedback.textContent = "Email copiado. Podés pegarlo en tu aplicación de correo.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(emailAddress);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = "Email seleccionado. Copialo con Ctrl+C, ⌘C o el menú de tu dispositivo.";
    }
  });

  const form = document.getElementById("contact-form");
  form?.querySelector('[type="submit"]').removeAttribute("disabled");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const company = String(fields.get("company") || "").trim();
    const service = String(fields.get("service") || "").trim();
    const message = String(fields.get("message") || "").trim();
    if (!name || message.length < 10) {
      form.querySelector(".form-feedback").textContent = "Completá tu nombre y contanos un poco más sobre el proyecto.";
      (name ? document.getElementById("contact-message") : document.getElementById("contact-name")).focus();
      return;
    }
    const subject = encodeURIComponent(`Consulta RQubo · ${service}`);
    const body = encodeURIComponent(`Hola, equipo de RQubo:\r\n\r\nSoy ${name}.${company ? `\r\nEmpresa: ${company}` : ""}\r\nMe interesa: ${service}.\r\n\r\n${message}\r\n\r\nGracias.`);
    form.querySelector(".form-feedback").textContent = "Tu consulta está preparada. Confirmá el envío en tu aplicación de correo; si no se abre, usá el email que figura al lado.";
    window.location.href = `mailto:${RQUBO_CONTACT.email}?subject=${subject}&body=${body}`;
  });
})();
