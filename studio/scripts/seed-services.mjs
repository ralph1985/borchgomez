import { getCliClient } from "sanity/cli";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const rootDir = resolve("..");
const siteSettingsPath = resolve(rootDir, "src/infrastructure/content/data/site-settings.json");
const servicesPath = resolve(rootDir, "src/infrastructure/content/data/services.json");
const serviceIconNames = new Set(["drone", "video", "share", "globe", "monitor-search", "chart", "map-pin"]);

try {
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
  const siteSettings = readJson(siteSettingsPath);
  const fallbackServices = readJson(servicesPath);
  const services = readServicesFallback(siteSettings.servicesIntro, fallbackServices);
  const client = getCliClient({ apiVersion });
  const items = [];

  for (const service of services.items) {
    const item = {
      _key: service.id,
      _type: "object",
      id: service.id,
      title: service.title,
      icon: service.icon,
      description: service.description,
      statusLabel: service.statusLabel,
      statusText: service.statusText,
      features: service.features,
    };

    if (service.image) {
      const imagePath = resolveAssetPath(service.image.src);

      if (!existsSync(imagePath)) {
        throw new Error(`Service image does not exist for ${service.id}: ${imagePath}`);
      }

      const asset = await client.assets.upload("image", createReadStream(imagePath), {
        filename: basename(imagePath),
      });

      item.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: service.image.alt,
      };
    }

    items.push(removeUndefined(item));
  }

  await client.createOrReplace({
    _id: "services",
    _type: "services",
    intro: services.intro,
    items,
  });

  console.log(`Seeded Sanity services document with ${items.length} services.`);
} catch (error) {
  console.error(`Could not seed Sanity services document. ${readErrorMessage(error)}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readServicesFallback(intro, services) {
  assertObject(intro, "Local services intro fallback is missing.");

  if (!Array.isArray(services)) {
    throw new Error("Local services fallback must be an array.");
  }

  return {
    intro: {
      title: readRequiredString(intro.title, "servicesIntro.title"),
      subtitle: readRequiredString(intro.subtitle, "servicesIntro.subtitle"),
    },
    items: services.map(readService),
  };
}

function readService(service, index) {
  assertObject(service, `Local services[${index}] must be an object.`);

  const icon = readRequiredString(service.icon, `services[${index}].icon`);

  if (!serviceIconNames.has(icon)) {
    throw new Error(`Local services[${index}].icon uses an unknown icon: ${icon}.`);
  }

  return {
    id: readRequiredString(service.id, `services[${index}].id`),
    title: readRequiredString(service.title, `services[${index}].title`),
    icon,
    description: readOptionalString(service.description),
    statusLabel: readOptionalString(service.statusLabel),
    statusText: readOptionalString(service.statusText),
    features: readOptionalStringArray(service.features, `services[${index}].features`),
    image: readOptionalImage(service.image, `services[${index}].image`),
  };
}

function readOptionalImage(image, fieldName) {
  if (image === undefined || image === null) {
    return undefined;
  }

  assertObject(image, `Local ${fieldName} must be an object when provided.`);

  return {
    src: readRequiredString(image.src, `${fieldName}.src`),
    alt: readRequiredString(image.alt, `${fieldName}.alt`),
  };
}

function resolveAssetPath(src) {
  const pathname = src.split("?")[0];
  const relativePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  return resolve(rootDir, "public", relativePath.replace(/^assets\//, "assets/"));
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

function assertObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
}

function readRequiredString(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`Local field ${fieldName} must be a string.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`Local field ${fieldName} cannot be empty.`);
  }

  return trimmed;
}

function readOptionalString(value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function readOptionalStringArray(value, fieldName) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`Local field ${fieldName} must be an array when provided.`);
  }

  const strings = value.map((item, index) => readRequiredString(item, `${fieldName}[${index}]`));

  return strings.length > 0 ? strings : undefined;
}

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
