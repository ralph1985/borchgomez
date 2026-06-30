export function getPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canAnimate(anime) {
  return anime && typeof anime.animate === "function";
}
