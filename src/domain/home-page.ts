import type { Plan, PlansContent } from "./plan";
import type { Project } from "./project";
import type { Service } from "./service";
import type { SiteSettings } from "./site-settings";

export interface HomePageContent {
  site: SiteSettings;
  services: Service[];
  projects: Project[];
  plans: PlansContent;
}

export type { Plan, PlansContent, Project, Service, SiteSettings };
