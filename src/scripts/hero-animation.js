import { canAnimate, getPrefersReducedMotion } from "./dom.js";

export function initHeroAnimation({ anime }) {
  const heroSection = document.querySelector(".home");
  const heroData = document.querySelector(".home__data");
  const heroFrame = document.querySelector(".home__img");
  const heroVisual = document.querySelector(".home__video-frame, .home-image");
  const heroWords = document.querySelectorAll("[data-hero-word]");
  const heroTrace = document.querySelector(".home__trace path");
  const heroSupport = document.querySelectorAll(
    ".home__greeting, .home__career, .home__description, .home__claim, .home__button, .home__social"
  );

  if (!canAnimate(anime) || !heroFrame || !heroVisual) return;

  if (getPrefersReducedMotion()) {
    heroFrame.style.opacity = "1";
    heroFrame.style.transform = "none";
    heroFrame.style.clipPath = "none";
    heroVisual.style.transform = "none";
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
  heroVisual.style.transform = "scale(1.08)";

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

      anime.animate(heroVisual, {
        scale: 1,
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
