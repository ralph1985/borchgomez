import type { LegalPageContent } from "../domain/legal";
import type { Service, SiteSettings } from "../domain/home-page";
import type { ContentRepository } from "../ports/content-repository";
import { getLegalPage } from "../infrastructure/content/legal/legal-pages";

export type LegalPageSlug = "aviso-legal" | "politica-privacidad" | "politica-cookies";

export interface LegalPageData {
  site: SiteSettings;
  services: Service[];
  page: LegalPageContent;
}

export async function getLegalPageContent(repository: ContentRepository, slug: LegalPageSlug): Promise<LegalPageData> {
  const [{ site, services }, legalData] = await Promise.all([repository.getHomePageContent(), repository.getLegalData()]);

  return {
    site,
    services,
    page: getLegalPage(slug, legalData),
  };
}
