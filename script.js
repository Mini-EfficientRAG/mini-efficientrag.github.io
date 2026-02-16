// script.js — Mini-EfficientRAG project site (GitHub Pages)
// Works with the HTML I gave you (Tailwind + AOS), and degrades gracefully if
// some optional classes/elements/CSS aren't present.

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Mobile menu toggle
  // -----------------------------
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    // If you didn't set it hidden in HTML, keep behavior consistent:
    // start hidden on mobile.
    mobileMenu.classList.add("hidden");
  }

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      // Support both styles: template used "open", HTML fallback uses "hidden"
      mobileMenu.classList.toggle("open");
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileMenu) return;
      mobileMenu.classList.remove("open");
      mobileMenu.classList.add("hidden");
    });
  });

  // Close mobile menu when clicking outside of it (nice for phones)
  document.addEventListener("click", (e) => {
    if (!mobileMenu || !mobileMenuButton) return;
    const clickedInside =
      mobileMenu.contains(e.target) || mobileMenuButton.contains(e.target);
    const isOpen = mobileMenu.classList.contains("open") || !mobileMenu.classList.contains("hidden");
    if (!clickedInside && isOpen && window.innerWidth < 768) {
      mobileMenu.classList.remove("open");
      mobileMenu.classList.add("hidden");
    }
  });

  // -----------------------------
  // Smooth scroll for anchor links
  // -----------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const nav = document.querySelector("nav");
      const navHeight = nav ? nav.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  // -----------------------------
  // Navbar shadow on scroll
  // -----------------------------
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (!nav) return;
    if (window.pageYOffset > 10) nav.classList.add("nav-shadow");
    else nav.classList.remove("nav-shadow");
  });

  // -----------------------------
  // Counter animation
  // -----------------------------
  function animateCounter(element, target, duration = 1600) {
    const start = 0;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * progress);
      element.textContent = value.toString();
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target.toString();
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.classList.contains("counted")) return;

        const target = parseInt(el.getAttribute("data-target") || "0", 10);
        animateCounter(el, target);
        el.classList.add("counted");
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".counter").forEach((counter) => {
    counterObserver.observe(counter);
  });

  // -----------------------------
  // Hero parallax (subtle)
  // -----------------------------
  const heroSection = document.querySelector(".hero-parallax");
  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const heroContent = heroSection.querySelector(".hero-content");
      if (!heroContent) return;

      // Only within the hero viewport for stability
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity = `${1 - scrolled / (window.innerHeight * 1.2)}`;
      }
    });
  }

  // -----------------------------
  // Ripple effect on buttons/links with class="ripple"
  // (Safe even if you don't have CSS; we inject it below)
  // -----------------------------
  document.querySelectorAll(".ripple").forEach((button) => {
    // Ensure the ripple container behaves
    const computed = window.getComputedStyle(button);
    if (computed.position === "static") button.style.position = "relative";
    button.style.overflow = "hidden";

    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add("ripple-effect");

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // -----------------------------
  // Progress bar animation (.skill-bar-fill with data-width="85%")
  // -----------------------------
  const skillBars = document.querySelectorAll(".skill-bar-fill");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const width = entry.target.getAttribute("data-width") || "0%";
        entry.target.style.width = width;
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  // -----------------------------
  // Stagger animation for feature cards (optional)
  // -----------------------------
  const featureCards = document.querySelectorAll(".feature-card");
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 90);
      });
    },
    { threshold: 0.1 }
  );

  featureCards.forEach((card) => {
    // Only apply if not using AOS fade on the same element
    if (!card.hasAttribute("data-aos")) {
      card.style.opacity = "0";
      card.style.transform = "translateY(24px)";
      card.style.transition = "all 0.5s ease";
      cardObserver.observe(card);
    }
  });

  // -----------------------------
  // Simple particle background in hero section
  // -----------------------------
  function createParticles() {
    const particleContainer = document.getElementById("particles");
    if (!particleContainer) return;

    // avoid duplicating particles if script hot-reloads
    if (particleContainer.dataset.spawned === "1") return;
    particleContainer.dataset.spawned = "1";

    const count = 45;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.cssText = `
        position:absolute;
        width:${Math.random() * 5 + 2}px;
        height:${Math.random() * 5 + 2}px;
        background:rgba(255,255,255,${Math.random() * 0.45 + 0.2});
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 6}s infinite ease-in-out;
        animation-delay:${Math.random() * 5}s;
      `;
      particleContainer.appendChild(particle);
    }
  }
  createParticles();

  // -----------------------------
  // Highlight current section in nav (desktop)
  // -----------------------------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function updateActiveNav() {
    let current = "";
    const offset = 220;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - offset) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-indigo-600", "font-bold");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("text-indigo-600", "font-bold");
      }
    });
  }
  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  // -----------------------------
  // Scroll-to-top button (matches the HTML)
  // -----------------------------
  const scrollBtn = document.getElementById("scrollToTop");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollBtn.style.opacity = "1";
        scrollBtn.style.pointerEvents = "auto";
      } else {
        scrollBtn.style.opacity = "0";
        scrollBtn.style.pointerEvents = "none";
      }
    });
  }

  // -----------------------------
  // Easter egg: Konami code
  // -----------------------------
  let konamiCode = [];
  const konamiPattern = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
  ];

  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);

    if (konamiCode.join("") === konamiPattern.join("")) {
      document.body.style.animation = "rainbow 2s linear infinite";
    }
  });

  // -----------------------------
  // Add "loaded" class after load
  // -----------------------------
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
});

// Inject minimal CSS needed for ripple + particles + rainbow
const style = document.createElement("style");
style.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }

  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.65s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to { transform: scale(4); opacity: 0; }
  }

  .particle { pointer-events: none; }

  @keyframes float {
    0%   { transform: translateY(0px); opacity: 0.9; }
    50%  { transform: translateY(-18px); opacity: 0.6; }
    100% { transform: translateY(0px); opacity: 0.9; }
  }

  /* Optional: simple shadow class for nav */
  .nav-shadow { box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
`;
document.head.appendChild(style);
