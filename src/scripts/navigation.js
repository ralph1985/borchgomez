import { canAnimate, getPrefersReducedMotion } from "./dom.js";

const COLLAPSED_MENU_QUERY = "(max-width: 899px)";
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initNavigation({ anime }) {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const servicesMenuToggle = document.getElementById("services-menu-toggle");
  const servicesSubmenu = document.getElementById("services-submenu");
  const servicesSubmenuLinks = document.querySelectorAll(".nav__submenu-link");
  const header = document.getElementById("header");
  const hiddenDuringMenuState = new Map();

  function isCollapsedMenu() {
    return window.matchMedia(COLLAPSED_MENU_QUERY).matches;
  }

  function setInert(element, isInert) {
    if (!element) return;

    element.inert = isInert;
  }

  function rememberAccessibilityState(element) {
    if (hiddenDuringMenuState.has(element)) return;

    hiddenDuringMenuState.set(element, {
      ariaHidden: element.getAttribute("aria-hidden"),
      inert: Boolean(element.inert),
    });
  }

  function hideFromOpenMenu(element) {
    rememberAccessibilityState(element);
    element.setAttribute("aria-hidden", "true");
    setInert(element, true);
  }

  function restoreFromOpenMenu(element) {
    const previousState = hiddenDuringMenuState.get(element);

    if (!previousState) return;

    if (previousState.ariaHidden === null) {
      element.removeAttribute("aria-hidden");
    } else {
      element.setAttribute("aria-hidden", previousState.ariaHidden);
    }

    setInert(element, previousState.inert);
    hiddenDuringMenuState.delete(element);
  }

  function getElementsHiddenDuringOpenMenu() {
    const bodyElements = Array.from(document.body.children).filter((element) => element !== header && element.tagName !== "SCRIPT");
    const headerElements = header ? Array.from(header.querySelectorAll(".nav__brand, .nav__social-link")) : [];

    return [...bodyElements, ...headerElements];
  }

  function setOpenMenuAccessibility(isOpen) {
    if (!isCollapsedMenu()) {
      Array.from(hiddenDuringMenuState.keys()).forEach(restoreFromOpenMenu);
      return;
    }

    if (isOpen) {
      getElementsHiddenDuringOpenMenu().forEach(hideFromOpenMenu);
      return;
    }

    Array.from(hiddenDuringMenuState.keys()).forEach(restoreFromOpenMenu);
  }

  function isInInertSubtree(element) {
    for (let current = element; current; current = current.parentElement) {
      if (current.inert) return true;
    }

    return false;
  }

  function isVisibleFocusable(element) {
    return element instanceof HTMLElement && !isInInertSubtree(element) && element.offsetParent !== null;
  }

  function getOpenMenuFocusTargets() {
    if (!navToggle || !navMenu?.classList.contains("show-menu") || !isCollapsedMenu()) return [];

    const menuTargets = Array.from(navMenu.querySelectorAll(focusableSelector)).filter(isVisibleFocusable);
    const focusTargets = isVisibleFocusable(navToggle) ? [navToggle, ...menuTargets] : menuTargets;

    return focusTargets;
  }

  function focusFirstOpenMenuTarget() {
    const firstTarget = getOpenMenuFocusTargets()[0];

    if (firstTarget instanceof HTMLElement) {
      firstTarget.focus();
    }
  }

  function trapOpenMenuFocus(event) {
    if (event.key !== "Tab") return;

    const focusTargets = getOpenMenuFocusTargets();

    if (!focusTargets.length) return;

    const firstTarget = focusTargets[0];
    const lastTarget = focusTargets[focusTargets.length - 1];
    const currentTarget = document.activeElement;

    if (!focusTargets.includes(currentTarget)) {
      firstTarget.focus();
      event.preventDefault();
      return;
    }

    if (event.shiftKey && currentTarget === firstTarget) {
      lastTarget.focus();
      event.preventDefault();
      return;
    }

    if (!event.shiftKey && currentTarget === lastTarget) {
      firstTarget.focus();
      event.preventDefault();
    }
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

    const useAnimatedMenu = canAnimate(anime) && isCollapsedMenu() && !getPrefersReducedMotion();

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
      setOpenMenuAccessibility(isOpen);
      if (isOpen) focusFirstOpenMenuTarget();
      return;
    }

    if (isOpen) {
      navMenu.classList.add("show-menu");
      updateNavMenuAccessibility();
      setOpenMenuAccessibility(true);
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
      window.requestAnimationFrame(focusFirstOpenMenuTarget);
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
        setOpenMenuAccessibility(false);
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

      trapOpenMenuFocus(event);
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
    setOpenMenuAccessibility(Boolean(navMenu?.classList.contains("show-menu")));

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
}
