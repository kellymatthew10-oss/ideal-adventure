(function () {
  "use strict";

  // ── Footer year ──────────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ── Sticky header border on scroll ───────────────────────────
  const header = document.querySelector(".site-header");
  let lastScrollY = 0;

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
    lastScrollY = window.scrollY;
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ── Intersection Observer: fade-in on scroll ─────────────────
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const fadeElements = document.querySelectorAll(".fade-in");

  if (prefersReducedMotion) {
    fadeElements.forEach((el) => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    fadeElements.forEach((el) => observer.observe(el));
  }

  // ── Smooth scroll for anchor links ───────────────────────────
  function scrollToSection(targetId, behavior) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

    window.scrollTo({
      top: targetTop,
      behavior: behavior || (prefersReducedMotion ? "auto" : "smooth"),
    });

    history.pushState(null, "", targetId);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      scrollToSection(targetId);
    });
  });

  // Scroll to hash on load (e.g. index.html#performance)
  if (window.location.hash) {
    requestAnimationFrame(() => {
      scrollToSection(window.location.hash, "auto");
    });
  }

  // ── Subtle parallax on hero intro (name + headshot) ───────────
  const heroIntro = document.querySelector(".hero-intro");

  if (heroIntro && !prefersReducedMotion) {
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const offset = Math.min(scrollY * 0.08, 24);
          heroIntro.style.transform = `translateY(${-offset * 0.15}px)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }
})();
