import { createClient, type SanityClient } from "@sanity/client";
import type { HomePageContent, SiteSettings } from "../../../domain/home-page";
import type { ContentRepository } from "../../../ports/content-repository";

type HeroContent = SiteSettings["hero"];
type HeroAction = HeroContent["actions"][number];
type PurposeContent = SiteSettings["purpose"];
type PurposeItem = PurposeContent["items"][number];

interface SanityHeroDocument {
  greeting?: unknown;
  title?: unknown;
  career?: unknown;
  description?: unknown;
  claim?: unknown;
  actions?: Array<{
    label?: unknown;
    href?: unknown;
  }>;
}

interface SanityPurposeDocument {
  title?: unknown;
  subtitle?: unknown;
  items?: Array<{
    title?: unknown;
    text?: unknown;
  }>;
  closing?: unknown;
}

interface SanityHomePageDocuments {
  hero: SanityHeroDocument | null;
  purpose: SanityPurposeDocument | null;
}

export interface SanityContentConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

const homePageQuery = `{
  "hero": *[_type == "hero" && _id == "hero"][0]{
    greeting,
    title,
    career,
    description,
    claim,
    actions[]{
      label,
      href
    }
  },
  "purpose": *[_type == "purpose" && _id == "purpose"][0]{
    title,
    subtitle,
    items[]{
      title,
      text
    },
    closing
  }
}`;

export class SanityContentRepository implements ContentRepository {
  private readonly client: SanityClient;

  constructor(
    private readonly fallbackRepository: ContentRepository,
    config: SanityContentConfig,
  ) {
    this.client = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      useCdn: false,
    });
  }

  async getHomePageContent(): Promise<HomePageContent> {
    const fallbackContent = await this.fallbackRepository.getHomePageContent();

    try {
      const documents = await this.client.fetch<SanityHomePageDocuments>(homePageQuery);

      return {
        ...fallbackContent,
        site: {
          ...fallbackContent.site,
          hero: mergeHero(fallbackContent.site.hero, documents.hero),
          purpose: mergePurpose(fallbackContent.site.purpose, documents.purpose),
        },
      };
    } catch (error) {
      console.warn(`Sanity content could not be loaded. Falling back to local JSON. ${readErrorMessage(error)}`);
      return fallbackContent;
    }
  }
}

function mergeHero(fallback: HeroContent, source: SanityHeroDocument | null): HeroContent {
  if (!source) {
    return fallback;
  }

  return {
    ...fallback,
    greeting: readString(source.greeting) ?? fallback.greeting,
    title: readString(source.title) ?? fallback.title,
    career: readString(source.career) ?? fallback.career,
    description: readString(source.description) ?? fallback.description,
    claim: readString(source.claim) ?? fallback.claim,
    actions: mergeHeroActions(fallback.actions, source.actions),
  };
}

function mergeHeroActions(fallbackActions: HeroAction[], sourceActions: SanityHeroDocument["actions"]): HeroAction[] {
  if (!Array.isArray(sourceActions) || sourceActions.length === 0) {
    return fallbackActions;
  }

  return fallbackActions.map((fallbackAction, index) => {
    const sourceAction = sourceActions[index];

    return {
      ...fallbackAction,
      label: readString(sourceAction?.label) ?? fallbackAction.label,
      href: readString(sourceAction?.href) ?? fallbackAction.href,
    };
  });
}

function mergePurpose(fallback: PurposeContent, source: SanityPurposeDocument | null): PurposeContent {
  if (!source) {
    return fallback;
  }

  return {
    title: readString(source.title) ?? fallback.title,
    subtitle: readString(source.subtitle) ?? fallback.subtitle,
    items: mergePurposeItems(fallback.items, source.items),
    closing: readString(source.closing) ?? fallback.closing,
  };
}

function mergePurposeItems(fallbackItems: PurposeItem[], sourceItems: SanityPurposeDocument["items"]): PurposeItem[] {
  if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
    return fallbackItems;
  }

  const maxLength = Math.max(fallbackItems.length, sourceItems.length);
  const mergedItems = Array.from({ length: maxLength }, (_, index): PurposeItem | null => {
    const sourceItem = sourceItems[index];
    const fallbackItem = fallbackItems[index];
    const title = readString(sourceItem?.title) ?? fallbackItem?.title;
    const text = readString(sourceItem?.text) ?? fallbackItem?.text;

    if (!title || !text) {
      return null;
    }

    return { title, text };
  }).filter((item): item is PurposeItem => item !== null);

  return mergedItems.length > 0 ? mergedItems : fallbackItems;
}

function readString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error.";
}
