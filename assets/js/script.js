const HEADER_SCROLL_OFFSET = 140;
const SECTION_ACTIVE_OFFSET = 80;

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("section[id]");
const header = document.getElementById("header");

function setMenuOpen(isOpen) {
  if (!navMenu || !navToggle) return;

  navMenu.classList.toggle("show-menu", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    setMenuOpen(!navMenu.classList.contains("show-menu"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target instanceof Node && !navMenu.contains(target) && !navToggle.contains(target)) {
      setMenuOpen(false);
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - SECTION_ACTIVE_OFFSET;
    const sectionId = current.getAttribute("id");
    const sectionLink = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);

    if (!sectionLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      sectionLink.classList.add("active-link");
    } else {
      sectionLink.classList.remove("active-link");
    }
  });
}

function scrollHeader() {
  if (!header) return;

  if (window.scrollY >= HEADER_SCROLL_OFFSET) {
    header.classList.add("scroll-header");
  } else {
    header.classList.remove("scroll-header");
  }
}

let scrollTicking = false;

function updateOnScroll() {
  scrollActive();
  scrollHeader();
  scrollTicking = false;
}

function requestScrollUpdate() {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(updateOnScroll);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("load", updateOnScroll);
updateOnScroll();

function initHeroAnimation() {
  const anime = window.anime;
  const heroSection = document.querySelector(".home");
  const heroFrame = document.querySelector(".home__img");
  const heroImage = document.querySelector(".home-image");
  const heroWords = document.querySelectorAll("[data-hero-word]");
  const heroTrace = document.querySelector(".home__trace path");
  const heroSupport = document.querySelectorAll(
    ".home__greeting, .home__career, .home__description, .home__claim, .home__button, .home__social"
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!anime || typeof anime.animate !== "function" || !heroFrame || !heroImage) return;

  if (reduceMotion) {
    heroFrame.style.opacity = "1";
    heroFrame.style.transform = "none";
    heroFrame.style.clipPath = "none";
    heroImage.style.transform = "none";
    heroFrame.classList.add("is-hero-awake");
    document.querySelector(".home__trace")?.style.setProperty("opacity", "1");
    return;
  }

  const motion = {
    pointerX: 0,
    pointerY: 0,
    scrollY: 0,
    currentX: 0,
    currentY: 0,
    currentRotate: 0,
  };
  let parallaxTicking = false;

  function renderHeroParallax() {
    motion.currentX += (motion.pointerX - motion.currentX) * 0.08;
    motion.currentY += (motion.pointerY + motion.scrollY - motion.currentY) * 0.08;
    motion.currentRotate += (motion.pointerX * 0.08 - motion.currentRotate) * 0.08;
    heroFrame.style.transform = `translate3d(${motion.currentX}px, ${motion.currentY}px, 0) rotate(${motion.currentRotate}deg)`;
    parallaxTicking = false;
  }

  function requestHeroParallax() {
    if (parallaxTicking) return;

    parallaxTicking = true;
    window.requestAnimationFrame(renderHeroParallax);
  }

  function updatePointerMotion(event) {
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    motion.pointerX = relativeX * 18;
    motion.pointerY = relativeY * 12;
    requestHeroParallax();
  }

  function updateScrollMotion() {
    const rect = heroFrame.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;

    motion.scrollY = (viewportCenter - rect.top - rect.height / 2) * 0.025;
    requestHeroParallax();
  }

  heroWords.forEach((word) => {
    word.style.opacity = "0";
    word.style.transform = "translateY(105%) rotate(4deg)";
  });

  heroSupport.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(18px)";
  });

  if (heroTrace) {
    const traceLength = heroTrace.getTotalLength();
    heroTrace.style.strokeDasharray = String(traceLength);
    heroTrace.style.strokeDashoffset = String(traceLength);
  }

  heroFrame.style.opacity = "0";
  heroFrame.style.clipPath = "inset(22% 0 22% 0 round 1rem)";
  heroFrame.style.transform = "translateY(46px) scale(0.9) rotate(-1.2deg)";
  heroImage.style.transform = "scale(1.18)";

  anime.animate(heroWords, {
    opacity: 1,
    y: 0,
    rotate: 0,
    duration: 820,
    ease: "outCubic",
    delay: (_target, index) => 120 + index * 95,
  });

  anime.animate(heroSupport, {
    opacity: 1,
    y: 0,
    duration: 760,
    ease: "outCubic",
    delay: (_target, index) => 540 + index * 85,
  });

  if (heroTrace) {
    anime.animate(".home__trace", {
      opacity: 1,
      duration: 500,
      ease: "outSine",
      delay: 560,
    });

    anime.animate(heroTrace, {
      strokeDashoffset: 0,
      duration: 1250,
      ease: "inOutSine",
      delay: 500,
    });
  }

  anime.animate(heroFrame, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    clipPath: "inset(0% 0 0% 0 round 1rem)",
    duration: 1350,
    ease: "outCubic",
    delay: 420,
    onComplete: () => {
      heroFrame.classList.add("is-hero-awake");
      heroFrame.style.opacity = "";
      heroFrame.style.clipPath = "";

      anime.animate(heroImage, {
        scale: 1.025,
        duration: 1100,
        ease: "outSine",
        onComplete: () => {
          window.addEventListener("pointermove", updatePointerMotion, { passive: true });
          window.addEventListener("scroll", updateScrollMotion, { passive: true });
          updateScrollMotion();
        },
      });
    },
  });
}

function initScrollAnimations() {
  const anime = window.anime;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!anime || typeof anime.animate !== "function" || reduceMotion || !("IntersectionObserver" in window)) return;

  const revealItems = document.querySelectorAll(
    "main section:not(.home) [data-animate]:not(.services__layout):not(.portfolio__container):not(.portfolio__preview-grid), .services__item, .portfolio__data, .portfolio__preview-item, .contact__panel, .footer__image"
  );
  const revealItemSet = new Set(revealItems);

  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(34px) scale(0.985)";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const siblings = [...element.parentElement.children].filter((child) => revealItemSet.has(child));
        const siblingIndex = siblings.indexOf(element);
        const delay = siblingIndex >= 0 ? Math.min(siblingIndex * 70, 360) : 0;

        observer.unobserve(element);

        anime.animate(element, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 760,
          ease: "outCubic",
          delay,
        });
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.16,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initInteractiveMotion() {
  const anime = window.anime;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!anime || typeof anime.animate !== "function" || reduceMotion) return;

  document.querySelectorAll(".home__hire, .home__download, .contact__primary, .contact__instagram").forEach((button) => {
    button.addEventListener("pointerenter", () => {
      anime.animate(button, {
        y: -3,
        scale: 1.035,
        duration: 260,
        ease: "outCubic",
      });
    });

    button.addEventListener("pointerleave", () => {
      anime.animate(button, {
        y: 0,
        scale: 1,
        duration: 300,
        ease: "outCubic",
      });
    });
  });

  document.querySelectorAll(".portfolio__data, .portfolio__preview-item, .services__item").forEach((card) => {
    card.addEventListener("pointerenter", () => {
      anime.animate(card, {
        y: -5,
        duration: 260,
        ease: "outCubic",
      });
    });

    card.addEventListener("pointerleave", () => {
      anime.animate(card, {
        y: 0,
        duration: 320,
        ease: "outCubic",
      });
    });
  });
}

initHeroAnimation();
initScrollAnimations();
initInteractiveMotion();

if (window.Swiper && document.querySelector(".swiper")) {
  new window.Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}
