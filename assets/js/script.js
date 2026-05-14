// Toggle navbar
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show-menu");
    });

    toggle.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        nav.classList.toggle("show-menu");
      }
    });
  }
};

showMenu("nav-toggle", "nav-menu");

// Remove menu for every click
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    navMenu.classList.remove("show-menu");
  }
}

navLink.forEach((n) => n.addEventListener("click", linkAction));

// Scroll Sections Active Link
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 80;
    const sectionId = current.getAttribute("id");
    const sectionLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

    if (!sectionLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      sectionLink.classList.add("active-link");
    } else {
      sectionLink.classList.remove("active-link");
    }
  });
}

window.addEventListener("scroll", scrollActive);

// Change BG Header
function scrollHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  if (window.scrollY >= 140) {
    header.classList.add("scroll-header");
  } else {
    header.classList.remove("scroll-header");
  }
}

window.addEventListener("scroll", scrollHeader);

// Swiper JS
new Swiper(".swiper", {
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

if (window.AOS) {
  window.AOS.init({ once: true, delay: 0 });
}
