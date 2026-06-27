import { getCliClient } from "sanity/cli";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve("..");
const siteSettingsPath = resolve(rootDir, "src/infrastructure/content/data/site-settings.json");
const imagePath = resolve(rootDir, "public/assets/img/borja-drone-foto-movil.jpg");

try {
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
  const siteSettings = readJson(siteSettingsPath);
  const about = readAboutFallback(siteSettings.about);

  if (!existsSync(imagePath)) {
    throw new Error(`About image does not exist: ${imagePath}`);
  }

  const client = getCliClient({ apiVersion });
  const asset = await client.assets.upload("image", createReadStream(imagePath), {
    filename: "borja-drone-foto-movil.jpg",
  });

  await client.createOrReplace({
    _id: "about",
    _type: "about",
    title: about.title,
    subtitle: about.subtitle,
    paragraphsBeforeImage: about.paragraphsBeforeImage,
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: about.image.alt,
    },
    paragraphsAfterImage: about.paragraphsAfterImage,
  });

  console.log("Seeded Sanity about document with uploaded image asset.");
} catch (error) {
  console.error(`Could not seed Sanity about document. ${readErrorMessage(error)}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readAboutFallback(about) {
  assertObject(about, "Local about fallback is missing.");
  assertObject(about.image, "Local about image fallback is missing.");

  return {
    title: readRequiredString(about.title, "about.title"),
    subtitle: readRequiredString(about.subtitle, "about.subtitle"),
    paragraphsBeforeImage: readRequiredStringArray(about.paragraphsBeforeImage, "about.paragraphsBeforeImage"),
    image: {
      alt: readRequiredString(about.image.alt, "about.image.alt"),
    },
    paragraphsAfterImage: readRequiredStringArray(about.paragraphsAfterImage, "about.paragraphsAfterImage"),
  };
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

function readRequiredStringArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`Local field ${fieldName} must be an array.`);
  }

  const strings = value.map((item, index) => readRequiredString(item, `${fieldName}[${index}]`));

  if (strings.length === 0) {
    throw new Error(`Local field ${fieldName} must include at least one item.`);
  }

  return strings;
}

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
