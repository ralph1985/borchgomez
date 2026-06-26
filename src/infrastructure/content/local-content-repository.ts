import type { HomePageContent } from "../../domain/home-page";
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
    };
  }
}
