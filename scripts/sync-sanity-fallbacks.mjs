import { createClient } from "@sanity/client";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteSettingsPath = resolve("src/infrastructure/content/data/site-settings.json");
const envPath = resolve(".env");

loadDotEnv(envPath);

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

try {
  const config = readSanityConfig();
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: false,
  });
  const siteSettings = readJson(siteSettingsPath);
  const documents = await client.fetch(homePageQuery);
  const hero = readHero(documents?.hero, siteSettings.hero);
  const purpose = readPurpose(documents?.purpose);

  const nextSiteSettings = {
    ...siteSettings,
    hero,
    purpose,
  };

  writeFileSync(siteSettingsPath, `${JSON.stringify(nextSiteSettings, null, 2)}\n`);
  console.log("Synced Sanity hero and purpose into src/infrastructure/content/data/site-settings.json.");
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
    claim: readRequiredString(source.claim, "hero.claim"),
    actions: sourceActions.map((action, index) => ({
      ...fallbackActions[index],
      label: readRequiredString(action?.label, `hero.actions[${index}].label`),
      href: readRequiredString(action?.href, `hero.actions[${index}].href`),
    })),
  };
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

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
