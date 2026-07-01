import { canAnimate, getPrefersReducedMotion } from "./dom.js";

export function initDecorativeAnimations({ anime }) {
  initLandscapeAnimation({ anime });
  initScrollRootGrowth({ anime });
  initFooterLandscapeAnimation({ anime });
  initScrollAnimations({ anime });
}

function initLandscapeAnimation({ anime }) {
  const rootPaths = document.querySelectorAll(".home__roots path");
  const fields = document.querySelectorAll(".home__field");
  const furrows = document.querySelectorAll(".home__furrows path");
  const olives = document.querySelectorAll(".home__olive");
  const crowns = document.querySelectorAll(".home__olive-crown");

  if (!canAnimate(anime) || !fields.length) return;

  if (getPrefersReducedMotion()) {
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

function initScrollRootGrowth({ anime }) {
  const rootsLayer = document.querySelector(".page-roots");
  const rootMasses = document.querySelectorAll(".page-roots__mass path, .page-roots__nodes circle");
  const rootPaths = document.querySelectorAll(".page-roots__cluster path, .page-roots__hairs path");

  if (!rootPaths.length) return;

  const rootData = [...rootPaths].map((path) => {
    const length = path.getTotalLength();

    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    return { path, length };
  });

  if (getPrefersReducedMotion()) {
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

  if (canAnimate(anime) && rootsLayer) {
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

function initFooterLandscapeAnimation({ anime }) {
  const footer = document.querySelector(".footer");
  const soils = document.querySelectorAll(".footer__land-soil");
  const furrows = document.querySelectorAll(".footer__furrows path");
  const roots = document.querySelectorAll(".footer__roots path");
  const reduceMotion = getPrefersReducedMotion();

  if (!canAnimate(anime) || !footer || !("IntersectionObserver" in window)) return;

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

function initScrollAnimations({ anime }) {
  if (!canAnimate(anime) || getPrefersReducedMotion() || !("IntersectionObserver" in window)) return;

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
