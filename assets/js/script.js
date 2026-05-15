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

if (window.AOS) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.AOS.init({
    once: true,
    delay: 0,
    duration: reduceMotion ? 0 : 400,
    disable: reduceMotion,
  });
}
