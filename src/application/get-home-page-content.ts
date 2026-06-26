import type { HomePageContent } from "../domain/home-page";
import type { ContentRepository } from "../ports/content-repository";

export async function getHomePageContent(repository: ContentRepository): Promise<HomePageContent> {
  return repository.getHomePageContent();
}
