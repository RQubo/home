"use strict";

// Canales de contacto de RQubo.
const RQUBO_CONTACT = Object.freeze({
  email: "rqubosoftware@gmail.com",
  whatsapp: "5492604235948", // Formato internacional: solo dígitos, sin + ni espacios.
  instagram: "https://www.instagram.com/rqubosoftware/"
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

  const processList = document.querySelector(".process-list");
  if (processList) {
    const steps = [...processList.children];
    let activeStep = 0;
    let processTimer;
    let processVisible = !("IntersectionObserver" in window);

    const highlightStep = (index) => {
      activeStep = index;
      steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
    };
    const refreshProcessAnimation = () => {
      window.clearInterval(processTimer);
      if (prefersReducedMotion.matches) highlightStep(0);
      if (!processVisible || document.hidden || prefersReducedMotion.matches || steps.length < 2) return;
      processTimer = window.setInterval(() => {
        highlightStep((activeStep + 1) % steps.length);
      }, 1600);
    };

    if ("IntersectionObserver" in window) {
      const processObserver = new IntersectionObserver(([entry]) => {
        processVisible = entry.isIntersecting;
        if (processVisible) highlightStep(0);
        refreshProcessAnimation();
      }, { threshold: 0.15 });
      processObserver.observe(processList);
    }
    document.addEventListener("visibilitychange", refreshProcessAnimation);
    prefersReducedMotion.addEventListener("change", refreshProcessAnimation);
    refreshProcessAnimation();
  }

  const profileImages = document.querySelectorAll("img[data-github-user]");
  const githubUsers = new Set([...profileImages].map((image) => image.dataset.githubUser));
  githubUsers.forEach(async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
      if (!response.ok) return;
      const { avatar_url: avatarUrl } = await response.json();
      const avatar = new URL(avatarUrl);
      if (avatar.protocol !== "https:") return;
      avatar.searchParams.set("s", "192");

      profileImages.forEach((image) => {
        if (image.dataset.githubUser !== username) return;
        const fallback = image.getAttribute("src");
        image.addEventListener("error", () => { image.src = fallback; }, { once: true });
        image.src = avatar.href;
      });
    } catch { /* Sin conexión o respuesta inválida: se conserva el ícono de avatar. */ }
  });

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
  }

  const whatsapp = document.querySelector("[data-contact-whatsapp]");
  if (whatsapp && /^\d{8,15}$/.test(RQUBO_CONTACT.whatsapp)) {
    const message = encodeURIComponent("Hola RQubo, quiero conversar sobre un proyecto.");
    whatsapp.href = `https://wa.me/${RQUBO_CONTACT.whatsapp}?text=${message}`;
  }
  const instagram = document.querySelector("[data-contact-instagram]");
  if (instagram) instagram.href = RQUBO_CONTACT.instagram;

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
  let sendingContact = false;
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sendingContact || !form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const company = String(fields.get("company") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const service = String(fields.get("service") || "").trim();
    const message = String(fields.get("message") || "").trim();
    const feedback = form.querySelector(".form-feedback");
    if (fields.get("_honey")) return;
    if (!name || message.length < 10) {
      feedback.dataset.state = "error";
      feedback.textContent = "Completá tu nombre y contanos un poco más sobre el proyecto.";
      (name ? document.getElementById("contact-message") : document.getElementById("contact-name")).focus();
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');
    const submitLabel = form.querySelector("[data-submit-label]");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    sendingContact = true;
    submitButton.disabled = true;
    submitLabel.textContent = "Enviando…";
    form.setAttribute("aria-busy", "true");
    feedback.dataset.state = "pending";
    feedback.textContent = "Estamos enviando tu consulta…";

    try {
      const response = await fetch(form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fields),
          name, company, email, service, message,
          _replyto: email,
          _subject: `Consulta RQubo · ${service}`,
          _url: window.location.href
        }),
        signal: controller.signal
      });
      const result = await response.json();
      if (response.ok && (result.success === false || result.success === "false") && /needs activation/i.test(String(result.message || ""))) {
        feedback.dataset.state = "error";
        feedback.textContent = `El formulario todavía no está habilitado. Por favor, escribinos a ${RQUBO_CONTACT.email}.`;
        return;
      }
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("Contact submission rejected");
      }
      feedback.dataset.state = "success";
      feedback.textContent = "¡Gracias! Tu consulta fue enviada. Te vamos a responder por email.";
      form.reset();
    } catch {
      feedback.dataset.state = "error";
      feedback.textContent = `No pudimos confirmar el envío. Intentá nuevamente o escribinos a ${RQUBO_CONTACT.email}.`;
    } finally {
      window.clearTimeout(timeout);
      sendingContact = false;
      submitButton.disabled = false;
      submitLabel.textContent = "Enviar consulta";
      form.removeAttribute("aria-busy");
    }
  });
})();
