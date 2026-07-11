import { createClient } from "@sanity/client";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteSettingsPath = resolve("src/infrastructure/content/data/site-settings.json");
const servicesPath = resolve("src/infrastructure/content/data/services.json");
const plansPath = resolve("src/infrastructure/content/data/plans.json");
const projectsPath = resolve("src/infrastructure/content/data/projects.json");
const envPath = resolve(".env");
const serviceIconNames = new Set(["drone", "video", "share", "globe", "monitor-search", "chart", "map-pin"]);

loadDotEnv(envPath);

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
    image{
      alt,
      "src": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    highlightedQuote,
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
    infoBoxes[]{
      title,
      blocks[]{
        title,
        points
      }
    },
    budgetNote
  },
  "services": *[_type == "services" && _id == "services"][0]{
    intro{
      title,
      subtitle
    },
    items[]{
      id,
      title,
      icon,
      description,
      statusLabel,
      statusText,
      features,
      image{
        alt,
        "src": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    }
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

try {
  const isCheckMode = readCheckMode(process.argv.slice(2));
  const fallbacks = await buildSanityFallbacks();

  if (isCheckMode) {
    checkFallbacks(fallbacks);
  } else {
    writeFallbacks(fallbacks);
  }
} catch (error) {
  console.error(`Could not sync Sanity fallbacks. ${readErrorMessage(error)}`);
  process.exitCode = 1;
}

function readCheckMode(args) {
  const invalidArgs = args.filter((arg) => arg !== "--check");

  if (invalidArgs.length > 0) {
    throw new Error(`Unsupported argument: ${invalidArgs.join(", ")}.`);
  }

  return args.includes("--check");
}

async function buildSanityFallbacks() {
  const config = readSanityConfig();
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: false,
  });
  const siteSettings = readJson(siteSettingsPath);
  const fallbackServices = readJson(servicesPath);
  const fallbackPlans = readJson(plansPath);
  const fallbackProjects = readJson(projectsPath);
  const documents = await client.fetch(homePageQuery);
  const hero = readHero(documents?.hero, siteSettings.hero);
  const purpose = readPurpose(documents?.purpose, siteSettings.purpose);
  const plans = readPlans(documents?.plans, fallbackPlans);
  const services = readServices(documents?.services, fallbackServices);
  const portfolio = readPortfolio(documents?.portfolio, fallbackProjects);
  const about = readAbout(documents?.about, siteSettings.about);
  const contact = readContact(documents?.contact);

  return [
    {
      path: siteSettingsPath,
      data: {
        ...siteSettings,
        hero,
        purpose,
        servicesIntro: services.intro,
        projectsIntro: portfolio.intro,
        about,
        contact,
      },
    },
    {
      path: servicesPath,
      data: services.items,
    },
    {
      path: plansPath,
      data: plans,
    },
    {
      path: projectsPath,
      data: portfolio.projects,
    },
  ];
}

function checkFallbacks(fallbacks) {
  const changedPaths = fallbacks
    .filter((fallback) => readFileSync(fallback.path, "utf8") !== formatJson(fallback.data))
    .map((fallback) => fallback.path);

  if (changedPaths.length === 0) {
    console.log("Sanity fallbacks are up to date.");
    return;
  }

  console.error(`Sanity fallbacks are out of sync:\n${changedPaths.map((path) => `- ${path}`).join("\n")}`);
  process.exitCode = 1;
}

function writeFallbacks(fallbacks) {
  for (const fallback of fallbacks) {
    writeFileSync(fallback.path, formatJson(fallback.data));
  }

  console.log(
    "Synced Sanity hero, purpose, services, portfolio, about and contact into src/infrastructure/content/data/site-settings.json, services into src/infrastructure/content/data/services.json, plans into src/infrastructure/content/data/plans.json and projects into src/infrastructure/content/data/projects.json.",
  );
}

function formatJson(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

function loadDotEnv(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = parseEnvValue(rawValue);
  }
}

function parseEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function readSanityConfig() {
  const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION;
  const missing = [];

  if (!projectId) missing.push("SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID");
  if (!dataset) missing.push("SANITY_DATASET or SANITY_STUDIO_DATASET");
  if (!apiVersion) missing.push("SANITY_API_VERSION");

  if (missing.length > 0) {
    throw new Error(`Missing required environment: ${missing.join(", ")}.`);
  }

  return { projectId, dataset, apiVersion };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readHero(source, fallbackHero) {
  assertObject(source, "Sanity hero document is missing.");
  assertObject(fallbackHero, "Local hero fallback is missing.");

  const fallbackActions = readArray(fallbackHero.actions, "Local hero actions must be an array.");
  const sourceActions = readArray(source.actions, "Sanity hero actions must be an array.");

  if (sourceActions.length !== fallbackActions.length) {
    throw new Error(
      `Sanity hero actions count (${sourceActions.length}) must match local fallback actions count (${fallbackActions.length}).`,
    );
  }

  return {
    ...fallbackHero,
    greeting: readRequiredString(source.greeting, "hero.greeting"),
    title: readRequiredString(source.title, "hero.title"),
    career: readRequiredString(source.career, "hero.career"),
    description: readRequiredString(source.description, "hero.description"),
    claims: readHeroClaims(source),
    actions: sourceActions.map((action, index) => ({
      ...fallbackActions[index],
      label: readRequiredString(action?.label, `hero.actions[${index}].label`),
      href: readRequiredString(action?.href, `hero.actions[${index}].href`),
    })),
  };
}

function readHeroClaims(source) {
  if (Array.isArray(source.claims)) {
    return source.claims
      .map((claim, index) => readOptionalString(claim, `hero.claims[${index}]`))
      .filter((claim) => claim !== undefined);
  }

  const legacyClaim = readOptionalString(source.claim, "hero.claim");

  return legacyClaim ? [legacyClaim] : [];
}

function readPurpose(source, fallbackPurpose) {
  assertObject(source, "Sanity purpose document is missing.");
  assertObject(fallbackPurpose, "Local purpose fallback is missing.");

  const sourceItems = readArray(source.items, "Sanity purpose items must be an array.");

  if (sourceItems.length === 0) {
    throw new Error("Sanity purpose items must include at least one block.");
  }

  return {
    title: readRequiredString(source.title, "purpose.title"),
    subtitle: readRequiredString(source.subtitle, "purpose.subtitle"),
    image: readOptionalPurposeImage(source.image, "purpose.image", fallbackPurpose.image),
    highlightedQuote: readOptionalString(source.highlightedQuote, "purpose.highlightedQuote") ?? fallbackPurpose.highlightedQuote,
    items: sourceItems.map((item, index) => ({
      title: readRequiredString(item?.title, `purpose.items[${index}].title`),
      text: readRequiredString(item?.text, `purpose.items[${index}].text`),
    })),
    closing: readRequiredString(source.closing, "purpose.closing"),
  };
}

function readOptionalPurposeImage(source, fieldName, fallbackImage) {
  if (source === undefined || source === null) {
    return readFallbackImage(fallbackImage, fieldName);
  }

  assertObject(source, `Sanity ${fieldName} must be an object when provided.`);
  assertLocalFallbackImage(fallbackImage, fieldName);

  readRequiredString(source.src, `${fieldName}.asset.url`);
  readRequiredPositiveNumber(source.width, `${fieldName}.asset.metadata.dimensions.width`);
  readRequiredPositiveNumber(source.height, `${fieldName}.asset.metadata.dimensions.height`);

  return {
    ...fallbackImage,
    alt: readRequiredString(source.alt, `${fieldName}.alt`),
  };
}

function readPlans(source, fallbackPlans) {
  assertObject(source, "Sanity plans document is missing.");
  assertObject(fallbackPlans, "Local plans fallback is missing.");
  assertObject(source.intro, "Sanity plans intro is missing.");
  assertObject(source.promo, "Sanity plans promo is missing.");

  const sourceItems = readArray(source.items, "Sanity plans items must be an array.");
  const promoFeatures = readRequiredStringArray(source.promo.features, "plans.promo.features");

  if (sourceItems.length === 0) {
    throw new Error("Sanity plans items must include at least one plan.");
  }

  return {
    intro: {
      title: readRequiredString(source.intro.title, "plans.intro.title"),
      subtitle: readRequiredString(source.intro.subtitle, "plans.intro.subtitle"),
    },
    items: sourceItems.map(readPlan),
    promo: {
      title: readRequiredString(source.promo.title, "plans.promo.title"),
      price: readOptionalString(source.promo.price, "plans.promo.price"),
      description: readRequiredString(source.promo.description, "plans.promo.description"),
      features: promoFeatures,
      note: readRequiredString(source.promo.note, "plans.promo.note"),
    },
    infoBoxes: readPlansInfoBoxes(source.infoBoxes, fallbackPlans.infoBoxes),
    budgetNote: readRequiredString(source.budgetNote, "plans.budgetNote"),
  };
}

function readServices(source, fallbackServices) {
  assertObject(source, "Sanity services document is missing.");

  const sourceItems = readArray(source.items, "Sanity services items must be an array.");

  if (sourceItems.length === 0) {
    throw new Error("Sanity services items must include at least one service.");
  }

  return {
    intro: {
      title: readRequiredString(source.intro?.title, "services.intro.title"),
      subtitle: readRequiredString(source.intro?.subtitle, "services.intro.subtitle"),
    },
    items: sourceItems.map((service, index) => readService(service, index, fallbackServices[index])),
  };
}

function readService(service, index, fallbackService) {
  assertObject(service, `Sanity services.items[${index}] must be an object.`);

  const icon = readRequiredString(service.icon, `services.items[${index}].icon`);

  if (!serviceIconNames.has(icon)) {
    throw new Error(`Sanity services.items[${index}].icon uses an unknown icon: ${icon}.`);
  }

  return removeUndefined({
    id: readRequiredString(service.id, `services.items[${index}].id`),
    title: readRequiredString(service.title, `services.items[${index}].title`),
    icon,
    description: readOptionalString(service.description, `services.items[${index}].description`),
    statusLabel: readOptionalString(service.statusLabel, `services.items[${index}].statusLabel`),
    statusText: readOptionalString(service.statusText, `services.items[${index}].statusText`),
    features: readOptionalStringArray(service.features, `services.items[${index}].features`),
    image: readOptionalServiceImage(service.image, `services.items[${index}].image`, fallbackService?.image),
  });
}

function readOptionalServiceImage(source, fieldName, fallbackImage) {
  if (source === undefined || source === null) {
    return undefined;
  }

  assertObject(source, `Sanity ${fieldName} must be an object when provided.`);
  assertLocalFallbackImage(fallbackImage, fieldName);

  readRequiredString(source.src, `${fieldName}.asset.url`);
  readRequiredPositiveNumber(source.width, `${fieldName}.asset.metadata.dimensions.width`);
  readRequiredPositiveNumber(source.height, `${fieldName}.asset.metadata.dimensions.height`);

  return {
    ...fallbackImage,
    alt: readRequiredString(source.alt, `${fieldName}.alt`),
  };
}

function readPortfolio(source, fallbackProjects) {
  assertObject(source, "Sanity portfolio document is missing.");

  const filters = readProjectFilters(source.filters);
  const validFilterValues = new Set(filters.map((filter) => filter.value).filter((value) => value !== "all"));
  const sourceProjects = readArray(source.projects, "Sanity portfolio projects must be an array.");

  if (sourceProjects.length === 0) {
    throw new Error("Sanity portfolio projects must include at least one project.");
  }

  return {
    intro: {
      title: readRequiredString(source.title, "portfolio.title"),
      subtitle: readRequiredString(source.subtitle, "portfolio.subtitle"),
      filters,
      initialVisible: readRequiredPositiveInteger(source.initialVisible, "portfolio.initialVisible"),
      loadStep: readRequiredPositiveInteger(source.loadStep, "portfolio.loadStep"),
    },
    projects: sourceProjects.map((project, index) => readProject(project, index, fallbackProjects[index], validFilterValues)),
  };
}

function readProjectFilters(source) {
  const filters = readArray(source, "Sanity portfolio filters must be an array.").map((filter, index) => {
    assertObject(filter, `Sanity portfolio.filters[${index}] must be an object.`);

    return {
      label: readRequiredString(filter.label, `portfolio.filters[${index}].label`),
      value: readRequiredString(filter.value, `portfolio.filters[${index}].value`),
    };
  });

  if (!filters.some((filter) => filter.value === "all")) {
    throw new Error("Sanity portfolio filters must include the all filter.");
  }

  const uniqueValues = new Set(filters.map((filter) => filter.value));

  if (uniqueValues.size !== filters.length) {
    throw new Error("Sanity portfolio filters cannot include duplicate values.");
  }

  return filters;
}

function readProject(project, index, fallbackProject, validFilterValues) {
  assertObject(project, `Sanity portfolio.projects[${index}] must be an object.`);
  assertObject(project.image, `Sanity portfolio.projects[${index}].image is missing.`);
  assertObject(project.link, `Sanity portfolio.projects[${index}].link is missing.`);

  const filters = readRequiredStringArray(project.filterValues, `portfolio.projects[${index}].filterValues`);
  const invalidFilters = filters.filter((filter) => !validFilterValues.has(filter));

  if (invalidFilters.length > 0) {
    throw new Error(`Sanity portfolio.projects[${index}] uses unknown filters: ${invalidFilters.join(", ")}.`);
  }

  readRequiredString(project.image.src, `portfolio.projects[${index}].image.asset.url`);
  readRequiredPositiveNumber(project.image.width, `portfolio.projects[${index}].image.asset.metadata.dimensions.width`);
  readRequiredPositiveNumber(project.image.height, `portfolio.projects[${index}].image.asset.metadata.dimensions.height`);

  return {
    title: readRequiredString(project.title, `portfolio.projects[${index}].title`),
    subtitle: readOptionalString(project.subtitle, `portfolio.projects[${index}].subtitle`) ?? "",
    category: readRequiredString(project.category, `portfolio.projects[${index}].category`),
    filter: filters[0],
    filters,
    image: {
      ...readFallbackImage(fallbackProject?.image, `portfolio.projects[${index}].image`),
      alt: readRequiredString(project.image.alt, `portfolio.projects[${index}].image.alt`),
    },
    link: {
      label: readRequiredString(project.link.label, `portfolio.projects[${index}].link.label`),
      href: readRequiredString(project.link.href, `portfolio.projects[${index}].link.href`),
    },
  };
}

function readFallbackImage(fallbackImage, fieldName) {
  assertLocalFallbackImage(fallbackImage, fieldName);

  return {
    ...fallbackImage,
  };
}

function assertLocalFallbackImage(fallbackImage, fieldName) {
  assertObject(fallbackImage, `Local fallback image is missing for Sanity ${fieldName}.`);

  const src = readRequiredString(fallbackImage.src, `${fieldName}.fallback.src`);

  if (isRemoteUrl(src)) {
    throw new Error(`Local fallback image for Sanity ${fieldName} must use a local asset path, not ${src}.`);
  }
}

function isRemoteUrl(value) {
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value);
}

function readAbout(source, fallbackAbout) {
  assertObject(source, "Sanity about document is missing.");
  assertObject(fallbackAbout, "Local about fallback is missing.");
  assertObject(fallbackAbout.image, "Local about image fallback is missing.");
  assertObject(source.image, "Sanity about image is missing.");

  const imageAlt = readRequiredString(source.image.alt, "about.image.alt");
  readRequiredString(source.image.src, "about.image.asset.url");
  readRequiredPositiveNumber(source.image.width, "about.image.asset.metadata.dimensions.width");
  readRequiredPositiveNumber(source.image.height, "about.image.asset.metadata.dimensions.height");

  return {
    title: readRequiredString(source.title, "about.title"),
    subtitle: readRequiredString(source.subtitle, "about.subtitle"),
    paragraphsBeforeImage: readRequiredStringArray(source.paragraphsBeforeImage, "about.paragraphsBeforeImage"),
    image: {
      ...fallbackAbout.image,
      alt: imageAlt,
    },
    paragraphsAfterImage: readRequiredStringArray(source.paragraphsAfterImage, "about.paragraphsAfterImage"),
  };
}

function readContact(source) {
  assertObject(source, "Sanity contact document is missing.");

  return {
    title: readRequiredString(source.title, "contact.title"),
    subtitle: readRequiredString(source.subtitle, "contact.subtitle"),
    primary: readContactLink(source.primary, "contact.primary"),
    phone: readContactLink(source.phone, "contact.phone"),
    email: readContactLink(source.email, "contact.email"),
    instagram: readContactLink(source.instagram, "contact.instagram"),
  };
}

function readContactLink(source, fieldName) {
  assertObject(source, `Sanity ${fieldName} is missing.`);

  return {
    label: readRequiredString(source.label, `${fieldName}.label`),
    href: readRequiredString(source.href, `${fieldName}.href`),
  };
}

function readPlan(plan, index) {
  assertObject(plan, `Sanity plans.items[${index}] must be an object.`);
  assertObject(plan.cta, `Sanity plans.items[${index}].cta is missing.`);

  const nextPlan = {
    name: readRequiredString(plan.name, `plans.items[${index}].name`),
    price: readRequiredString(plan.price, `plans.items[${index}].price`),
    tagline: readRequiredString(plan.tagline, `plans.items[${index}].tagline`),
    featured: undefined,
    badge: undefined,
    features: readRequiredStringArray(plan.features, `plans.items[${index}].features`),
    cta: {
      label: readRequiredString(plan.cta.label, `plans.items[${index}].cta.label`),
      href: readRequiredString(plan.cta.href, `plans.items[${index}].cta.href`),
    },
  };

  const featured = readOptionalBoolean(plan.featured, `plans.items[${index}].featured`);
  const badge = readOptionalString(plan.badge, `plans.items[${index}].badge`);

  if (featured !== undefined) {
    nextPlan.featured = featured;
  }

  if (badge !== undefined) {
    nextPlan.badge = badge;
  }

  return nextPlan;
}

function readPlansInfoBoxes(source, fallbackInfoBoxes) {
  if (source === undefined || source === null) {
    return Array.isArray(fallbackInfoBoxes) ? fallbackInfoBoxes : [];
  }

  return readArray(source, "Sanity plans.infoBoxes must be an array.").map(readPlansInfoBox);
}

function readPlansInfoBox(box, index) {
  assertObject(box, `Sanity plans.infoBoxes[${index}] must be an object.`);

  return {
    title: readRequiredString(box.title, `plans.infoBoxes[${index}].title`),
    blocks: readArray(box.blocks, `Sanity plans.infoBoxes[${index}].blocks must be an array.`).map((block, blockIndex) =>
      readPlansInfoBlock(block, index, blockIndex),
    ),
  };
}

function readPlansInfoBlock(block, boxIndex, blockIndex) {
  assertObject(block, `Sanity plans.infoBoxes[${boxIndex}].blocks[${blockIndex}] must be an object.`);

  return {
    title: readRequiredString(block.title, `plans.infoBoxes[${boxIndex}].blocks[${blockIndex}].title`),
    points: readRequiredStringArray(block.points, `plans.infoBoxes[${boxIndex}].blocks[${blockIndex}].points`),
  };
}

function assertObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
}

function readArray(value, message) {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }

  return value;
}

function readRequiredString(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`Sanity field ${fieldName} must be a string.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`Sanity field ${fieldName} cannot be empty.`);
  }

  return trimmed;
}

function readOptionalString(value, fieldName) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`Sanity field ${fieldName} must be a string when provided.`);
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function readOptionalBoolean(value, fieldName) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Sanity field ${fieldName} must be a boolean when provided.`);
  }

  return value;
}

function readRequiredPositiveNumber(value, fieldName) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Sanity field ${fieldName} must be a positive number.`);
  }

  return value;
}

function readRequiredPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`Sanity field ${fieldName} must be a positive integer.`);
  }

  return value;
}

function readRequiredStringArray(value, fieldName) {
  const items = readArray(value, `Sanity field ${fieldName} must be an array.`);
  const strings = items.map((item, index) => readRequiredString(item, `${fieldName}[${index}]`));

  if (strings.length === 0) {
    throw new Error(`Sanity field ${fieldName} must include at least one item.`);
  }

  return strings;
}

function readOptionalStringArray(value, fieldName) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const items = readArray(value, `Sanity field ${fieldName} must be an array when provided.`);
  const strings = items.map((item, index) => readRequiredString(item, `${fieldName}[${index}]`));

  return strings.length > 0 ? strings : undefined;
}

function removeUndefined(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (Array.isArray(entry)) {
        return entry.length > 0;
      }

      return entry !== undefined;
    }),
  );
}

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
