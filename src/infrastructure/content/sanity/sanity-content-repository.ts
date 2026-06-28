import { createClient, type SanityClient } from "@sanity/client";
import type { HomePageContent, Plan, PlansContent, Project, SiteSettings } from "../../../domain/home-page";
import type { ContentRepository } from "../../../ports/content-repository";

type HeroContent = SiteSettings["hero"];
type HeroAction = HeroContent["actions"][number];
type PurposeContent = SiteSettings["purpose"];
type PurposeItem = PurposeContent["items"][number];
type AboutContent = SiteSettings["about"];
type ContactContent = SiteSettings["contact"];
type ContactLink = ContactContent["primary"];
type ProjectsIntroContent = SiteSettings["projectsIntro"];
type ProjectFilter = ProjectsIntroContent["filters"][number];
type PromoContent = PlansContent["promo"];

interface SanityHeroDocument {
  greeting?: unknown;
  title?: unknown;
  career?: unknown;
  description?: unknown;
  claim?: unknown;
  claims?: unknown;
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

interface SanityPlanDocument {
  intro?: {
    title?: unknown;
    subtitle?: unknown;
  };
  items?: Array<{
    name?: unknown;
    price?: unknown;
    tagline?: unknown;
    featured?: unknown;
    badge?: unknown;
    features?: unknown;
    cta?: {
      label?: unknown;
      href?: unknown;
    };
  }>;
  promo?: {
    title?: unknown;
    price?: unknown;
    description?: unknown;
    features?: unknown;
    note?: unknown;
  };
  budgetNote?: unknown;
}

type SanityPlanItem = NonNullable<SanityPlanDocument["items"]>[number];

interface SanityAboutDocument {
  title?: unknown;
  subtitle?: unknown;
  paragraphsBeforeImage?: unknown;
  image?: {
    src?: unknown;
    alt?: unknown;
    width?: unknown;
    height?: unknown;
  };
  paragraphsAfterImage?: unknown;
}

interface SanityContactDocument {
  title?: unknown;
  subtitle?: unknown;
  primary?: SanityContactLink;
  phone?: SanityContactLink;
  email?: SanityContactLink;
  instagram?: SanityContactLink;
}

interface SanityContactLink {
  label?: unknown;
  href?: unknown;
}

interface SanityPortfolioDocument {
  title?: unknown;
  subtitle?: unknown;
  filters?: Array<{
    label?: unknown;
    value?: unknown;
  }>;
  initialVisible?: unknown;
  loadStep?: unknown;
  projects?: Array<{
    title?: unknown;
    subtitle?: unknown;
    category?: unknown;
    filterValues?: unknown;
    image?: {
      src?: unknown;
      alt?: unknown;
      width?: unknown;
      height?: unknown;
    };
    link?: {
      label?: unknown;
      href?: unknown;
    };
  }>;
}

type SanityProjectItem = NonNullable<SanityPortfolioDocument["projects"]>[number];

interface SanityHomePageDocuments {
  hero: SanityHeroDocument | null;
  purpose: SanityPurposeDocument | null;
  plans: SanityPlanDocument | null;
  portfolio: SanityPortfolioDocument | null;
  about: SanityAboutDocument | null;
  contact: SanityContactDocument | null;
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
    claims,
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
  },
  "plans": *[_type == "plans" && _id == "plans"][0]{
    intro{
      title,
      subtitle
    },
    items[]{
      name,
      price,
      tagline,
      featured,
      badge,
      features,
      cta{
        label,
        href
      }
    },
    promo{
      title,
      price,
      description,
      features,
      note
    },
    budgetNote
  },
  "portfolio": *[_type == "portfolio" && _id == "portfolio"][0]{
    title,
    subtitle,
    filters[]{
      label,
      value
    },
    initialVisible,
    loadStep,
    projects[]{
      title,
      subtitle,
      category,
      filterValues,
      image{
        alt,
        "src": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      },
      link{
        label,
        href
      }
    }
  },
  "about": *[_type == "about" && _id == "about"][0]{
    title,
    subtitle,
    paragraphsBeforeImage,
    image{
      alt,
      "src": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    paragraphsAfterImage
  },
  "contact": *[_type == "contact" && _id == "contact"][0]{
    title,
    subtitle,
    primary{
      label,
      href
    },
    phone{
      label,
      href
    },
    email{
      label,
      href
    },
    instagram{
      label,
      href
    }
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
          projectsIntro: mergeProjectsIntro(fallbackContent.site.projectsIntro, documents.portfolio),
          about: mergeAbout(fallbackContent.site.about, documents.about),
          contact: mergeContact(fallbackContent.site.contact, documents.contact),
        },
        projects: mergeProjects(fallbackContent.projects, documents.portfolio),
        plans: mergePlans(fallbackContent.plans, documents.plans),
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
    claims: readHeroClaims(source),
    actions: mergeHeroActions(fallback.actions, source.actions),
  };
}

function readHeroClaims(source: SanityHeroDocument): string[] {
  if (Array.isArray(source.claims)) {
    return source.claims
      .map(readString)
      .filter((claim): claim is string => claim !== undefined);
  }

  const legacyClaim = readString(source.claim);
  if (legacyClaim) {
    return [legacyClaim];
  }

  return [];
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

function mergePlans(fallback: PlansContent, source: SanityPlanDocument | null): PlansContent {
  if (!source) {
    return fallback;
  }

  return {
    intro: {
      title: readString(source.intro?.title) ?? fallback.intro.title,
      subtitle: readString(source.intro?.subtitle) ?? fallback.intro.subtitle,
    },
    items: mergePlanItems(fallback.items, source.items),
    promo: mergePromo(fallback.promo, source.promo),
    budgetNote: readString(source.budgetNote) ?? fallback.budgetNote,
  };
}

function mergePlanItems(fallbackItems: Plan[], sourceItems: SanityPlanDocument["items"]): Plan[] {
  if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
    return fallbackItems;
  }

  const mergedItems = sourceItems.map(readPlan).filter((plan): plan is Plan => plan !== null);

  return mergedItems.length > 0 ? mergedItems : fallbackItems;
}

function readPlan(source: SanityPlanItem | undefined): Plan | null {
  const name = readString(source?.name);
  const price = readString(source?.price);
  const tagline = readString(source?.tagline);
  const features = readStringArray(source?.features);
  const ctaLabel = readString(source?.cta?.label);
  const ctaHref = readString(source?.cta?.href);

  if (!name || !price || !tagline || features.length === 0 || !ctaLabel || !ctaHref) {
    return null;
  }

  return {
    name,
    price,
    tagline,
    featured: typeof source?.featured === "boolean" ? source.featured : undefined,
    badge: readString(source?.badge),
    features,
    cta: {
      label: ctaLabel,
      href: ctaHref,
    },
  };
}

function mergePromo(fallback: PromoContent, source: SanityPlanDocument["promo"]): PromoContent {
  return {
    title: readString(source?.title) ?? fallback.title,
    price: readString(source?.price) ?? fallback.price,
    description: readString(source?.description) ?? fallback.description,
    features: readStringArray(source?.features, fallback.features),
    note: readString(source?.note) ?? fallback.note,
  };
}

function mergeProjectsIntro(fallback: ProjectsIntroContent, source: SanityPortfolioDocument | null): ProjectsIntroContent {
  if (!source) {
    return fallback;
  }

  return {
    title: readString(source.title) ?? fallback.title,
    subtitle: readString(source.subtitle) ?? fallback.subtitle,
    filters: mergeProjectFilters(fallback.filters, source.filters),
    initialVisible: readPositiveInteger(source.initialVisible) ?? fallback.initialVisible,
    loadStep: readPositiveInteger(source.loadStep) ?? fallback.loadStep,
  };
}

function mergeProjectFilters(fallbackFilters: ProjectFilter[], sourceFilters: SanityPortfolioDocument["filters"]): ProjectFilter[] {
  if (!Array.isArray(sourceFilters) || sourceFilters.length === 0) {
    return fallbackFilters;
  }

  const filters = sourceFilters
    .map((filter): ProjectFilter | null => {
      const label = readString(filter.label);
      const value = readString(filter.value);

      if (!label || !value) {
        return null;
      }

      return { label, value };
    })
    .filter((filter): filter is ProjectFilter => filter !== null);

  return filters.some((filter) => filter.value === "all") ? filters : fallbackFilters;
}

function mergeProjects(fallbackProjects: Project[], source: SanityPortfolioDocument | null): Project[] {
  if (!source || !Array.isArray(source.projects) || source.projects.length === 0) {
    return fallbackProjects;
  }

  const validFilters = new Set(mergeProjectFilters([], source.filters).map((filter) => filter.value));
  const projects = source.projects
    .map((project, index) => readProject(project, fallbackProjects[index], validFilters))
    .filter((project): project is Project => project !== null);

  return projects.length > 0 ? projects : fallbackProjects;
}

function readProject(source: SanityProjectItem | undefined, fallback: Project | undefined, validFilters: Set<string>): Project | null {
  const title = readString(source?.title) ?? fallback?.title;
  const subtitle = readString(source?.subtitle) ?? fallback?.subtitle;
  const category = readString(source?.category) ?? fallback?.category;
  const filters = readProjectFilterValues(source?.filterValues, fallback, validFilters);
  const image = mergeProjectImage(fallback?.image, source?.image);
  const linkLabel = readString(source?.link?.label) ?? fallback?.link.label;
  const linkHref = readString(source?.link?.href) ?? fallback?.link.href;

  if (!title || !category || filters.length === 0 || !image || !linkLabel || !linkHref) {
    return null;
  }

  return {
    title,
    subtitle,
    category,
    filter: filters[0],
    filters,
    image,
    link: {
      label: linkLabel,
      href: linkHref,
    },
  };
}

function readProjectFilterValues(value: unknown, fallback: Project | undefined, validFilters: Set<string>): string[] {
  const sourceFilters = Array.isArray(value) ? value.map(readString).filter((filter): filter is string => filter !== undefined) : [];
  const fallbackFilters = fallback?.filters?.length ? fallback.filters : fallback?.filter ? [fallback.filter] : [];
  const filters = sourceFilters.length > 0 ? sourceFilters : fallbackFilters;
  const uniqueFilters = [...new Set(filters)].filter((filter) => filter !== "all");

  if (validFilters.size === 0) {
    return uniqueFilters;
  }

  return uniqueFilters.filter((filter) => validFilters.has(filter));
}

function mergeProjectImage(fallback: Project["image"] | undefined, source: SanityProjectItem["image"]): Project["image"] | null {
  const src = readString(source?.src);
  const alt = readString(source?.alt) ?? fallback?.alt;
  const width = readPositiveNumber(source?.width) ?? fallback?.width;
  const height = readPositiveNumber(source?.height) ?? fallback?.height;

  if (!src || !alt || width === undefined || height === undefined) {
    return fallback ?? null;
  }

  return {
    src,
    alt,
    width,
    height,
  };
}

function mergeAbout(fallback: AboutContent, source: SanityAboutDocument | null): AboutContent {
  if (!source) {
    return fallback;
  }

  return {
    title: readString(source.title) ?? fallback.title,
    subtitle: readString(source.subtitle) ?? fallback.subtitle,
    paragraphsBeforeImage: readStringArray(source.paragraphsBeforeImage, fallback.paragraphsBeforeImage),
    image: mergeAboutImage(fallback.image, source.image),
    paragraphsAfterImage: readStringArray(source.paragraphsAfterImage, fallback.paragraphsAfterImage),
  };
}

function mergeAboutImage(fallback: AboutContent["image"], source: SanityAboutDocument["image"]): AboutContent["image"] {
  const src = readString(source?.src);
  const alt = readString(source?.alt);
  const width = readPositiveNumber(source?.width);
  const height = readPositiveNumber(source?.height);

  if (!src || !alt || width === undefined || height === undefined) {
    return fallback;
  }

  return {
    src,
    alt,
    width,
    height,
  };
}

function mergeContact(fallback: ContactContent, source: SanityContactDocument | null): ContactContent {
  if (!source) {
    return fallback;
  }

  return {
    title: readString(source.title) ?? fallback.title,
    subtitle: readString(source.subtitle) ?? fallback.subtitle,
    primary: mergeContactLink(fallback.primary, source.primary),
    phone: mergeContactLink(fallback.phone, source.phone),
    email: mergeContactLink(fallback.email, source.email),
    instagram: mergeContactLink(fallback.instagram, source.instagram),
  };
}

function mergeContactLink(fallback: ContactLink, source: SanityContactLink | undefined): ContactLink {
  return {
    label: readString(source?.label) ?? fallback.label,
    href: readString(source?.href) ?? fallback.href,
  };
}

function readStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const strings = value
    .map(readString)
    .filter((item): item is string => item !== undefined);

  return strings.length > 0 ? strings : fallback;
}

function readPositiveNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return value;
}

function readPositiveInteger(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return undefined;
  }

  return value;
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
