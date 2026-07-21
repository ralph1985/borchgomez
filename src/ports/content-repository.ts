import type { HomePageContent } from "../domain/home-page";
import type { LegalData } from "../domain/legal";

export interface ContentRepository {
  getHomePageContent(): Promise<HomePageContent>;
  getLegalData(): Promise<LegalData>;
}
