import * as anime from "animejs";

import { initDecorativeAnimations } from "./decorative-animations.js";
import { initDevTools } from "./dev-tools.js";
import { initHeroAnimation } from "./hero-animation.js";
import { initInteractiveMotion } from "./interactive-motion.js";
import { initNavigation } from "./navigation.js";
import { initPortfolioFilters } from "./portfolio-filters.js";
import { initScrollState } from "./scroll-state.js";

initNavigation({ anime });
initDevTools();
initScrollState();
initHeroAnimation({ anime });
initDecorativeAnimations({ anime });
initInteractiveMotion({ anime });
initPortfolioFilters();
