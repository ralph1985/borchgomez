import type { Plan, PlansContent, PlansInfoBox } from "./plan";
import type { Project } from "./project";
import type { Service } from "./service";
import type { SiteSettings } from "./site-settings";

export interface HomePageContent {
  site: SiteSettings;
  services: Service[];
  projects: Project[];
  plans: PlansContent;
  devInspection: HomePageDevInspection;
}

export type DevContentSource = "sanity" | "fallback" | "hardcoded";

export interface DevInspectionField {
  label: string;
  source: DevContentSource;
  document?: string;
  field?: string;
  file?: string;
}

export interface DevInspectionBlock {
  component: string;
  source: DevContentSource;
  document?: string;
  field?: string;
  file?: string;
  fields?: DevInspectionField[];
}

export interface HomePageDevInspection {
  hero: DevInspectionBlock;
  purpose: DevInspectionBlock;
  services: DevInspectionBlock;
  footer: DevInspectionBlock;
}

export type { Plan, PlansContent, PlansInfoBox, Project, Service, SiteSettings };
