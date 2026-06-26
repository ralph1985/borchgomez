import type { HomePageContent } from "../domain/home-page";

export interface ContentRepository {
  getHomePageContent(): Promise<HomePageContent>;
}
