const HEADER_SCROLL_OFFSET = 140;
const SECTION_ACTIVE_OFFSET = 80;

export function initScrollState() {
  const sections = document.querySelectorAll("section[id]");
  const header = document.getElementById("header");
  const servicesMenuToggle = document.getElementById("services-menu-toggle");
  let scrollTicking = false;

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
}
