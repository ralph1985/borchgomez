export function initPortfolioFilters() {
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
}
