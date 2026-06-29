import { getCliClient } from "sanity/cli";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve("..");
const plansPath = resolve(rootDir, "src/infrastructure/content/data/plans.json");

try {
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
  const plans = readJson(plansPath);
  const infoBoxes = readInfoBoxes(plans.infoBoxes);
  const client = getCliClient({ apiVersion });

  await client
    .patch("plans")
    .set({ infoBoxes })
    .commit();

  console.log(`Seeded Sanity plans infoBoxes with ${infoBoxes.length} box(es).`);
} catch (error) {
  console.error(`Could not seed Sanity plans infoBoxes. ${readErrorMessage(error)}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readInfoBoxes(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Local plans.infoBoxes must include at least one box.");
  }

  return value.map((box, index) => {
    assertObject(box, `Local plans.infoBoxes[${index}] must be an object.`);

    return {
      _key: slugify(readRequiredString(box.title, `plans.infoBoxes[${index}].title`)),
      _type: "object",
      title: readRequiredString(box.title, `plans.infoBoxes[${index}].title`),
      blocks: readInfoBlocks(box.blocks, index),
    };
  });
}

function readInfoBlocks(value, boxIndex) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Local plans.infoBoxes[${boxIndex}].blocks must include at least one block.`);
  }

  return value.map((block, index) => {
    assertObject(block, `Local plans.infoBoxes[${boxIndex}].blocks[${index}] must be an object.`);

    return {
      _key: slugify(readRequiredString(block.title, `plans.infoBoxes[${boxIndex}].blocks[${index}].title`)),
      _type: "object",
      title: readRequiredString(block.title, `plans.infoBoxes[${boxIndex}].blocks[${index}].title`),
      points: readRequiredStringArray(block.points, `plans.infoBoxes[${boxIndex}].blocks[${index}].points`),
    };
  });
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

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
