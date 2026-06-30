import { canAnimate, getPrefersReducedMotion } from "./dom.js";

export function initInteractiveMotion({ anime }) {
  if (!canAnimate(anime) || getPrefersReducedMotion()) return;

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
