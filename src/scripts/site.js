import * as anime from "animejs";

window.anime = anime;

const HEADER_SCROLL_OFFSET = 140;
const SECTION_ACTIVE_OFFSET = 80;

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const servicesMenuToggle = document.getElementById("services-menu-toggle");
const servicesSubmenu = document.getElementById("services-submenu");
const servicesSubmenuLinks = document.querySelectorAll(".nav__submenu-link");
const sections = document.querySelectorAll("section[id]");
const header = document.getElementById("header");

function isCollapsedMenu() {
  return window.matchMedia("(max-width: 899px)").matches;
}

function setInert(element, isInert) {
  if (!element) return;

  element.inert = isInert;
}

function updateNavMenuAccessibility() {
  if (!navMenu) return;

  const isHidden = isCollapsedMenu() && !navMenu.classList.contains("show-menu");
  navMenu.setAttribute("aria-hidden", String(isHidden));
  setInert(navMenu, isHidden);
}

function setServicesSubmenuOpen(isOpen) {
  if (!servicesMenuToggle || !servicesSubmenu) return;

  servicesMenuToggle.setAttribute("aria-expanded", String(isOpen));
  servicesSubmenu.setAttribute("aria-hidden", String(!isOpen));
  setInert(servicesSubmenu, !isOpen);
  servicesSubmenu.classList.toggle("is-open", isOpen);
}

function setMenuOpen(isOpen) {
  if (!navMenu || !navToggle) return;

  if (!isOpen) setServicesSubmenuOpen(false);

  const anime = window.anime;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const useAnimatedMenu = anime && typeof anime.animate === "function" && isCollapsedMenu() && !reduceMotion;

  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");

  if (!useAnimatedMenu) {
    navMenu.classList.toggle("show-menu", isOpen);
    navMenu.style.opacity = "";
    navMenu.style.transform = "";
    navLinks.forEach((link) => {
      link.style.opacity = "";
      link.style.transform = "";
    });
    updateNavMenuAccessibility();
    return;
  }

  if (isOpen) {
    navMenu.classList.add("show-menu");
    updateNavMenuAccessibility();
    navMenu.style.opacity = "0";
    navMenu.style.transform = "translateY(-18px) scale(0.98)";
    navLinks.forEach((link) => {
      link.style.opacity = "0";
      link.style.transform = "translateY(-10px)";
    });

    anime.animate(navMenu, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 420,
      ease: "outCubic",
    });

    anime.animate(navToggle, {
      rotate: 90,
      duration: 320,
      ease: "outCubic",
    });

    anime.animate(navLinks, {
      opacity: 1,
      y: 0,
      duration: 360,
      ease: "outCubic",
      delay: (_target, index) => 80 + index * 45,
    });
    return;
  }

  anime.animate(navLinks, {
    opacity: 0,
    y: -8,
    duration: 180,
    ease: "inCubic",
    delay: (_target, index) => index * 18,
  });

  anime.animate(navMenu, {
    opacity: 0,
    y: -18,
    scale: 0.985,
    duration: 260,
    ease: "inCubic",
    delay: 80,
    onComplete: () => {
      navMenu.classList.remove("show-menu");
      navMenu.style.opacity = "";
      navMenu.style.transform = "";
      navLinks.forEach((link) => {
        link.style.opacity = "";
        link.style.transform = "";
      });
      navToggle.style.transform = "";
      updateNavMenuAccessibility();
    },
  });

  anime.animate(navToggle, {
    rotate: 0,
    duration: 240,
    ease: "outCubic",
  });
}

if (navToggle && navMenu) {
  updateNavMenuAccessibility();

  navToggle.addEventListener("click", () => {
    setMenuOpen(!navMenu.classList.contains("show-menu"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const wasServicesOpen = servicesSubmenu?.classList.contains("is-open");
      const wasMenuOpen = navMenu.classList.contains("show-menu");

      setServicesSubmenuOpen(false);
      setMenuOpen(false);

      if (wasServicesOpen) {
        servicesMenuToggle?.focus();
        return;
      }

      if (wasMenuOpen) {
        navToggle.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) return;

    if (servicesSubmenu && servicesMenuToggle && !servicesSubmenu.contains(target) && !servicesMenuToggle.contains(target)) {
      setServicesSubmenuOpen(false);
    }

    if (!navMenu.contains(target) && !navToggle.contains(target)) {
      setMenuOpen(false);
    }
  });
}

if (servicesMenuToggle && servicesSubmenu) {
  setServicesSubmenuOpen(false);

  servicesMenuToggle.addEventListener("click", () => {
    setServicesSubmenuOpen(!servicesSubmenu.classList.contains("is-open"));
  });
}

navLinks.forEach((link) => {
  if (link !== servicesMenuToggle) {
    link.addEventListener("click", () => setMenuOpen(false));
  }
});

servicesSubmenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setServicesSubmenuOpen(false);
    setMenuOpen(false);
  });
});

window.addEventListener("resize", () => {
  setServicesSubmenuOpen(false);
  updateNavMenuAccessibility();

  if (isCollapsedMenu() || !navMenu || !navToggle) return;

  navMenu.classList.remove("show-menu");
  navMenu.style.opacity = "";
  navMenu.style.transform = "";
  navToggle.style.transform = "";
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
  updateNavMenuAccessibility();
  navLinks.forEach((link) => {
    link.style.opacity = "";
    link.style.transform = "";
  });
});

function scrollActive() {
  const scrollY = window.scrollY;
  const sectionOffset = Math.max(SECTION_ACTIVE_OFFSET, header ? header.offsetHeight : 0);

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - sectionOffset;
    const sectionId = current.getAttribute("id");
    const sectionLink = sectionId === "services"
      ? servicesMenuToggle
      : document.querySelector(`.nav__menu a[href="#${sectionId}"]`);

    if (!sectionLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      sectionLink.classList.add("active-link");
      sectionLink.setAttribute("aria-current", "location");
    } else {
      sectionLink.classList.remove("active-link");
      sectionLink.removeAttribute("aria-current");
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
  const heroData = document.querySelector(".home__data");
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
    exitProgress: 0,
    currentX: 0,
    currentY: 0,
    currentRotate: 0,
  };
  let parallaxTicking = false;

  function renderHeroParallax() {
    const exitX = motion.exitProgress * 96;
    const exitY = motion.exitProgress * 28;
    const targetFrameX = motion.pointerX + exitX;
    const targetFrameY = motion.pointerY + motion.scrollY + exitY;
    const targetRotate = motion.pointerX * 0.08 + motion.exitProgress * 2.4;

    motion.currentX += (targetFrameX - motion.currentX) * 0.08;
    motion.currentY += (targetFrameY - motion.currentY) * 0.08;
    motion.currentRotate += (targetRotate - motion.currentRotate) * 0.08;
    heroFrame.style.transform = `translate3d(${motion.currentX}px, ${motion.currentY}px, 0) rotate(${motion.currentRotate}deg)`;

    if (heroData) {
      const dataX = motion.exitProgress * -82;
      const dataY = motion.exitProgress * 18;
      const dataOpacity = 1 - motion.exitProgress * 0.58;

      heroData.style.transform = `translate3d(${dataX}px, ${dataY}px, 0)`;
      heroData.style.opacity = String(dataOpacity);
    }

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
    if (!heroSection) return;

    const rect = heroFrame.getBoundingClientRect();
    const sectionRect = heroSection.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const exitDistance = Math.max(heroSection.offsetHeight * 0.72, 1);
    const rawExitProgress = Math.min(Math.max(-sectionRect.top / exitDistance, 0), 1);

    motion.scrollY = (viewportCenter - rect.top - rect.height / 2) * 0.025;
    motion.exitProgress = rawExitProgress * rawExitProgress * (3 - 2 * rawExitProgress);
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
    document.querySelector(".home__trace").style.opacity = "0";
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
          window.addEventListener("resize", updateScrollMotion);
          updateScrollMotion();
        },
      });
    },
  });
}

function initLandscapeAnimation() {
  const anime = window.anime;
  const rootPaths = document.querySelectorAll(".home__roots path");
  const fields = document.querySelectorAll(".home__field");
  const furrows = document.querySelectorAll(".home__furrows path");
  const olives = document.querySelectorAll(".home__olive");
  const crowns = document.querySelectorAll(".home__olive-crown");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!anime || typeof anime.animate !== "function" || !fields.length) return;

  if (reduceMotion) {
    fields.forEach((field) => {
      field.style.opacity = "1";
      field.style.transform = "none";
    });
    olives.forEach((olive) => {
      olive.style.opacity = "0.82";
      olive.style.transform = "none";
    });
    rootPaths.forEach((rootPath) => {
      rootPath.style.strokeDasharray = "";
      rootPath.style.strokeDashoffset = "";
    });
    return;
  }

  rootPaths.forEach((rootPath) => {
    const rootLength = rootPath.getTotalLength();

    rootPath.style.strokeDasharray = String(rootLength);
    rootPath.style.strokeDashoffset = String(rootLength);
  });

  fields.forEach((field) => {
    field.style.opacity = "0";
    field.style.transform = "translateY(28px) scaleY(0.92)";
  });

  olives.forEach((olive) => {
    olive.style.opacity = "0";
    olive.style.transform = "translateY(18px) scale(0.88)";
  });

  furrows.forEach((furrow) => {
    const furrowLength = furrow.getTotalLength();

    furrow.style.strokeDasharray = String(furrowLength);
    furrow.style.strokeDashoffset = String(furrowLength);
  });

  anime.animate(rootPaths, {
    strokeDashoffset: 0,
    duration: 2100,
    ease: "inOutSine",
    delay: (_target, index) => 240 + index * 115,
  });

  anime.animate(fields, {
    opacity: [0, 1],
    y: 0,
    scaleY: 1,
    duration: 1200,
    ease: "outCubic",
    delay: (_target, index) => 520 + index * 160,
  });

  anime.animate(furrows, {
    strokeDashoffset: 0,
    duration: 1500,
    ease: "inOutSine",
    delay: (_target, index) => 860 + index * 120,
  });

  anime.animate(olives, {
    opacity: [0, 0.82],
    y: 0,
    scale: 1,
    duration: 980,
    ease: "outBack",
    delay: (_target, index) => 1040 + index * 170,
  });

  anime.animate(rootPaths, {
    opacity: [0.42, 1],
    duration: 3600,
    ease: "inOutSine",
    alternate: true,
    loop: true,
    delay: 2300,
  });

  anime.animate(crowns, {
    rotate: [-1.2, 1.2],
    scale: [1, 1.025],
    duration: 4200,
    ease: "inOutSine",
    alternate: true,
    loop: true,
    delay: 1650,
  });

  anime.animate(furrows, {
    opacity: [0.58, 0.95],
    duration: 3600,
    ease: "inOutSine",
    alternate: true,
    loop: true,
    delay: 1900,
  });
}

function initScrollRootGrowth() {
  const anime = window.anime;
  const rootsLayer = document.querySelector(".page-roots");
  const rootMasses = document.querySelectorAll(".page-roots__mass path, .page-roots__nodes circle");
  const rootPaths = document.querySelectorAll(".page-roots__cluster path, .page-roots__hairs path");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!rootPaths.length) return;

  const rootData = [...rootPaths].map((path) => {
    const length = path.getTotalLength();

    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    return { path, length };
  });

  if (reduceMotion) {
    rootData.forEach(({ path }) => {
      path.style.strokeDashoffset = "0";
    });
    rootMasses.forEach((mass) => {
      mass.style.opacity = "";
      mass.style.transform = "";
    });
    return;
  }

  rootMasses.forEach((mass) => {
    mass.style.opacity = "0";
    mass.style.transform = "scaleY(0.82)";
  });

  if (anime && typeof anime.animate === "function" && rootsLayer) {
    rootsLayer.style.opacity = "0";

    anime.animate(rootsLayer, {
      opacity: 0.16,
      duration: 900,
      ease: "outSine",
      delay: 500,
    });
  }

  let ticking = false;

  function updateRootGrowth() {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    const easedProgress = 1 - Math.pow(1 - progress, 1.7);

    rootData.forEach(({ path, length }, index) => {
      const pathOffset = Math.max(easedProgress * 1.22 - index * 0.035, 0);
      const pathProgress = Math.min(pathOffset, 1);

      path.style.strokeDashoffset = String(length * (1 - pathProgress));
    });

    rootMasses.forEach((mass, index) => {
      const massOffset = Math.max(easedProgress * 1.16 - index * 0.025, 0);
      const massProgress = Math.min(massOffset, 1);
      const baseOpacity = mass.tagName.toLowerCase() === "circle" ? 0.12 : 0.09;
      const scaleY = 0.82 + massProgress * 0.18;

      mass.style.opacity = String(baseOpacity * massProgress);
      mass.style.transform = `scaleY(${scaleY})`;
    });

    ticking = false;
  }

  function requestRootGrowth() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(updateRootGrowth);
  }

  window.addEventListener("scroll", requestRootGrowth, { passive: true });
  window.addEventListener("resize", requestRootGrowth);
  updateRootGrowth();
}

function initFooterLandscapeAnimation() {
  const anime = window.anime;
  const footer = document.querySelector(".footer");
  const soils = document.querySelectorAll(".footer__land-soil");
  const furrows = document.querySelectorAll(".footer__furrows path");
  const roots = document.querySelectorAll(".footer__roots path");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!anime || typeof anime.animate !== "function" || !footer || !("IntersectionObserver" in window)) return;

  const drawablePaths = [...furrows, ...roots].map((path) => {
    const length = path.getTotalLength();

    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = reduceMotion ? "0" : String(length);
    return path;
  });

  if (reduceMotion) return;

  soils.forEach((soil) => {
    soil.style.opacity = "0";
    soil.style.transform = "translateY(34px) scaleY(0.94)";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);

        anime.animate(soils, {
          opacity: [0, 1],
          y: 0,
          scaleY: 1,
          duration: 1050,
          ease: "outCubic",
          delay: (_target, index) => index * 160,
        });

        anime.animate(drawablePaths, {
          strokeDashoffset: 0,
          duration: 1550,
          ease: "inOutSine",
          delay: (_target, index) => 280 + index * 105,
        });
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.18,
    }
  );

  observer.observe(footer);
}

function initScrollAnimations() {
  const anime = window.anime;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!anime || typeof anime.animate !== "function" || reduceMotion || !("IntersectionObserver" in window)) return;

  document.querySelectorAll("main section:not(.home) .section-title").forEach((title) => {
    if (title.querySelector(".section-title__line")) return;

    title.classList.add("has-animated-line");
    const line = document.createElement("span");
    line.className = "section-title__line";
    line.setAttribute("aria-hidden", "true");
    title.appendChild(line);
  });

  const revealItems = document.querySelectorAll(
    "main section:not(.home) [data-animate]:not(.services__layout):not(.portfolio__container):not(.portfolio__grid), .services__item, .portfolio__data, .portfolio__card, .plans__card, .plans__promo, .contact__panel, .footer__image"
  );
  const revealItemSet = new Set(revealItems);

  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(34px) scale(0.985)";
  });

  document.querySelectorAll(".about__story p, .services__item h3, .services__item p").forEach((detail) => {
    detail.style.opacity = "0";
    detail.style.transform = "translateX(-10px)";
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

        if (element.classList.contains("section-title")) {
          const titleLine = element.querySelector(".section-title__line");

          if (titleLine) {
            anime.animate(titleLine, {
              scaleX: 1,
              duration: 640,
              ease: "outCubic",
              delay: delay + 220,
            });
          }
        }

        if (element.classList.contains("about__story")) {
          anime.animate(element.querySelectorAll("p"), {
            opacity: [0, 1],
            x: [-12, 0],
            duration: 520,
            ease: "outCubic",
            delay: (_target, index) => delay + 160 + index * 90,
          });
        }

        if (element.classList.contains("services__item")) {
          anime.animate(element.querySelectorAll("h3, p"), {
            opacity: [0, 1],
            x: [-10, 0],
            duration: 520,
            ease: "outCubic",
            delay: (_target, index) => delay + 100 + index * 70,
          });
        }

        if (element.classList.contains("portfolio__data") || element.classList.contains("portfolio__card")) {
          const portfolioImage = element.querySelector(".portfolio__img img");

          if (portfolioImage) {
            anime.animate(portfolioImage, {
              scale: [1.045, 1],
              duration: 900,
              ease: "outCubic",
              delay: delay + 110,
            });
          }
        }
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

  document.querySelectorAll(".home__hire, .home__download, .contact__primary, .plans__cta").forEach((button) => {
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

  document.querySelectorAll(".portfolio__data, .portfolio__card, .services__item, .plans__card").forEach((card) => {
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
initLandscapeAnimation();
initScrollRootGrowth();
initFooterLandscapeAnimation();
initScrollAnimations();
initInteractiveMotion();

(function initPortfolioFilters() {
  const portfolio = document.querySelector(".portfolio");
  const INITIAL_VISIBLE = Number.parseInt(portfolio?.dataset.initialVisible, 10) || 6;
  const LOAD_STEP = Number.parseInt(portfolio?.dataset.loadStep, 10) || 6;
  const filters = document.querySelectorAll(".portfolio__filter");
  const cards = document.querySelectorAll(".portfolio__card[data-categories]");
  const showMoreBtn = document.querySelector(".portfolio__show-more");
  const status = document.getElementById("portfolio-status");
  let activeFilter = "all";
  let visibleLimit = INITIAL_VISIBLE;

  if (!filters.length || !cards.length) return;

  function getVisibleCards() {
    return Array.from(cards).filter((card) => !card.classList.contains("hidden") && !card.classList.contains("portfolio__card--overflow"));
  }

  function renderPortfolio() {
    let visibleCount = 0;
    let totalMatching = 0;

    cards.forEach((card) => {
      const categories = (card.dataset.categories || "").split(/\s+/).filter(Boolean);
      const match = activeFilter === "all" || categories.includes(activeFilter);
      if (!match) {
        card.classList.add("hidden");
        card.classList.remove("portfolio__card--overflow");
        return;
      }
      totalMatching++;
      if (visibleCount < visibleLimit) {
        card.classList.remove("hidden", "portfolio__card--overflow");
        visibleCount++;
      } else {
        card.classList.add("portfolio__card--overflow");
        card.classList.remove("hidden");
      }
    });

    if (showMoreBtn) {
      const remainingCount = Math.max(totalMatching - visibleCount, 0);
      showMoreBtn.hidden = remainingCount === 0;
      showMoreBtn.textContent = `Mostrar más proyectos (${remainingCount} restantes)`;
    }

    if (status) {
      const visibleText = visibleCount === 1 ? "1 proyecto visible" : `${visibleCount} proyectos visibles`;
      const totalText = totalMatching === 1 ? "1 proyecto coincide" : `${totalMatching} proyectos coinciden`;
      status.textContent = `${visibleText}. ${totalText}.`;
    }
  }

  function applyVisibility(filter) {
    activeFilter = filter;
    visibleLimit = INITIAL_VISIBLE;
    renderPortfolio();
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filters.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      applyVisibility(filter);
    });
  });

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      const previouslyVisible = getVisibleCards().length;

      visibleLimit += LOAD_STEP;
      renderPortfolio();

      if (showMoreBtn.hidden) {
        const firstRevealedLink = getVisibleCards()[previouslyVisible]?.querySelector("a");

        if (firstRevealedLink instanceof HTMLElement) {
          firstRevealedLink.focus();
        }
      }
    });
  }

  applyVisibility("all");
})();

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
