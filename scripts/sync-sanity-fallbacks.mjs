import { createClient } from "@sanity/client";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteSettingsPath = resolve("src/infrastructure/content/data/site-settings.json");
const plansPath = resolve("src/infrastructure/content/data/plans.json");
const envPath = resolve(".env");

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
  const config = readSanityConfig();
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: false,
  });
  const siteSettings = readJson(siteSettingsPath);
  const fallbackPlans = readJson(plansPath);
  const documents = await client.fetch(homePageQuery);
  const hero = readHero(documents?.hero, siteSettings.hero);
  const purpose = readPurpose(documents?.purpose);
  const plans = readPlans(documents?.plans, fallbackPlans);
  const about = readAbout(documents?.about, siteSettings.about);
  const contact = readContact(documents?.contact);

  const nextSiteSettings = {
    ...siteSettings,
    hero,
    purpose,
    about,
    contact,
  };

  writeFileSync(siteSettingsPath, `${JSON.stringify(nextSiteSettings, null, 2)}\n`);
  writeFileSync(plansPath, `${JSON.stringify(plans, null, 2)}\n`);
  console.log(
    "Synced Sanity hero, purpose, about and contact into src/infrastructure/content/data/site-settings.json and plans into src/infrastructure/content/data/plans.json.",
  );
} catch (error) {
  console.error(`Could not sync Sanity fallbacks. ${readErrorMessage(error)}`);
  process.exitCode = 1;
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

function readPurpose(source) {
  assertObject(source, "Sanity purpose document is missing.");

  const sourceItems = readArray(source.items, "Sanity purpose items must be an array.");

  if (sourceItems.length === 0) {
    throw new Error("Sanity purpose items must include at least one block.");
  }

  return {
    title: readRequiredString(source.title, "purpose.title"),
    subtitle: readRequiredString(source.subtitle, "purpose.subtitle"),
    items: sourceItems.map((item, index) => ({
      title: readRequiredString(item?.title, `purpose.items[${index}].title`),
      text: readRequiredString(item?.text, `purpose.items[${index}].text`),
    })),
    closing: readRequiredString(source.closing, "purpose.closing"),
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
      price: readRequiredString(source.promo.price, "plans.promo.price"),
      description: readRequiredString(source.promo.description, "plans.promo.description"),
      features: promoFeatures,
      note: readRequiredString(source.promo.note, "plans.promo.note"),
    },
    budgetNote: readRequiredString(source.budgetNote, "plans.budgetNote"),
  };
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

function readRequiredStringArray(value, fieldName) {
  const items = readArray(value, `Sanity field ${fieldName} must be an array.`);
  const strings = items.map((item, index) => readRequiredString(item, `${fieldName}[${index}]`));

  if (strings.length === 0) {
    throw new Error(`Sanity field ${fieldName} must include at least one item.`);
  }

  return strings;
}

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
