import type { HomePageContent, HomePageDevInspection } from "../../domain/home-page";
import type { ContentRepository } from "../../ports/content-repository";
import plans from "./data/plans.json";
import projects from "./data/projects.json";
import services from "./data/services.json";
import site from "./data/site-settings.json";

export class LocalContentRepository implements ContentRepository {
  async getHomePageContent(): Promise<HomePageContent> {
    return {
      site,
      services,
      projects,
      plans,
      devInspection: localDevInspection,
    };
  }
}

const localDevInspection: HomePageDevInspection = {
  hero: {
    component: "HeroSection",
    source: "fallback",
    document: "hero",
    field: "hero",
    file: "src/infrastructure/content/data/site-settings.json",
    fields: [
      { label: "greeting", source: "fallback", document: "hero", field: "hero.greeting" },
      { label: "title", source: "fallback", document: "hero", field: "hero.title" },
      { label: "career", source: "fallback", document: "hero", field: "hero.career" },
      { label: "description", source: "fallback", document: "hero", field: "hero.description" },
      { label: "claims", source: "fallback", document: "hero", field: "hero.claims" },
      { label: "actions", source: "fallback", document: "hero", field: "hero.actions" },
      { label: "image", source: "fallback", file: "src/infrastructure/content/data/site-settings.json", field: "hero.image" },
    ],
  },
  purpose: {
    component: "PurposeSection",
    source: "fallback",
    document: "purpose",
    field: "purpose",
    file: "src/infrastructure/content/data/site-settings.json",
    fields: [
      { label: "title", source: "fallback", document: "purpose", field: "purpose.title" },
      { label: "subtitle", source: "fallback", document: "purpose", field: "purpose.subtitle" },
      { label: "items", source: "fallback", document: "purpose", field: "purpose.items" },
      { label: "closing", source: "fallback", document: "purpose", field: "purpose.closing" },
    ],
  },
  services: {
    component: "ServicesSection",
    source: "fallback",
    document: "services",
    field: "services",
    file: "src/infrastructure/content/data/services.json",
    fields: [
      { label: "intro.title", source: "fallback", document: "services", field: "services.intro.title" },
      { label: "intro.subtitle", source: "fallback", document: "services", field: "services.intro.subtitle" },
      { label: "items", source: "fallback", document: "services", field: "services.items" },
    ],
  },
  footer: {
    component: "BaseLayout",
    source: "fallback",
    file: "src/layouts/BaseLayout.astro",
    fields: [
      { label: "copy", source: "fallback", file: "src/infrastructure/content/data/site-settings.json", field: "footer.copy" },
      { label: "structure", source: "hardcoded", file: "src/layouts/BaseLayout.astro" },
    ],
  },
};
