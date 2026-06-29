import { getCliClient } from "sanity/cli";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const rootDir = resolve("..");
const siteSettingsPath = resolve(rootDir, "src/infrastructure/content/data/site-settings.json");
const projectsPath = resolve(rootDir, "src/infrastructure/content/data/projects.json");

try {
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";
  const siteSettings = readJson(siteSettingsPath);
  const fallbackProjects = readJson(projectsPath);
  const portfolio = readPortfolioFallback(siteSettings.projectsIntro, fallbackProjects);
  const client = getCliClient({ apiVersion });

  const projects = [];

  for (const [index, project] of portfolio.projects.entries()) {
    const imagePath = resolveAssetPath(project.image.src);

    if (!existsSync(imagePath)) {
      throw new Error(`Project image does not exist: ${imagePath}`);
    }

    const asset = await client.assets.upload("image", createReadStream(imagePath), {
      filename: basename(imagePath),
    });

    projects.push({
      _key: `${slugify(project.title)}-${index + 1}`,
      _type: "object",
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      filterValues: project.filters,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: project.image.alt,
      },
      link: project.link,
    });
  }

  await client.createOrReplace({
    _id: "portfolio",
    _type: "portfolio",
    title: portfolio.title,
    subtitle: portfolio.subtitle,
    filters: portfolio.filters,
    initialVisible: portfolio.initialVisible,
    loadStep: portfolio.loadStep,
    projects,
  });

  console.log(`Seeded Sanity portfolio document with ${projects.length} uploaded project images.`);
} catch (error) {
  console.error(`Could not seed Sanity portfolio document. ${readErrorMessage(error)}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readPortfolioFallback(intro, projects) {
  assertObject(intro, "Local projects intro fallback is missing.");
  const filters = readFilters(intro.filters);

  return {
    title: readRequiredString(intro.title, "projectsIntro.title"),
    subtitle: readRequiredString(intro.subtitle, "projectsIntro.subtitle"),
    filters,
    initialVisible: readRequiredPositiveInteger(intro.initialVisible, "projectsIntro.initialVisible"),
    loadStep: readRequiredPositiveInteger(intro.loadStep, "projectsIntro.loadStep"),
    projects: readProjects(projects, filters),
  };
}

function readFilters(filters) {
  if (!Array.isArray(filters)) {
    throw new Error("Local field projectsIntro.filters must be an array.");
  }

  const items = filters.map((filter, index) => {
    assertObject(filter, `Local field projectsIntro.filters[${index}] must be an object.`);

    return {
      _key: readRequiredString(filter.value, `projectsIntro.filters[${index}].value`),
      _type: "object",
      label: readRequiredString(filter.label, `projectsIntro.filters[${index}].label`),
      value: readRequiredString(filter.value, `projectsIntro.filters[${index}].value`),
    };
  });

  if (!items.some((filter) => filter.value === "all")) {
    throw new Error("Local projectsIntro.filters must include the all filter.");
  }

  return items;
}

function readProjects(projects, filters) {
  if (!Array.isArray(projects)) {
    throw new Error("Local projects fallback must be an array.");
  }

  const validFilters = new Set(filters.map((filter) => filter.value).filter((value) => value !== "all"));

  return projects.map((project, index) => {
    assertObject(project, `Local project ${index + 1} must be an object.`);
    assertObject(project.image, `Local project ${index + 1} image must be an object.`);
    assertObject(project.link, `Local project ${index + 1} link must be an object.`);

    const filterValues = readFilterValues(project, index);
    const invalidFilters = filterValues.filter((filter) => !validFilters.has(filter));

    if (invalidFilters.length > 0) {
      throw new Error(`Local project ${index + 1} uses unknown filters: ${invalidFilters.join(", ")}.`);
    }

    return {
      title: readRequiredString(project.title, `projects[${index}].title`),
      subtitle: readOptionalString(project.subtitle),
      category: readRequiredString(project.category, `projects[${index}].category`),
      filters: filterValues,
      image: {
        src: readRequiredString(project.image.src, `projects[${index}].image.src`),
        alt: readRequiredString(project.image.alt, `projects[${index}].image.alt`),
      },
      link: {
        label: readRequiredString(project.link.label, `projects[${index}].link.label`),
        href: readRequiredString(project.link.href, `projects[${index}].link.href`),
      },
    };
  });
}

function readFilterValues(project, index) {
  const source = Array.isArray(project.filters) && project.filters.length > 0 ? project.filters : [project.filter];
  const values = source.map((filter, filterIndex) =>
    readRequiredString(filter, `projects[${index}].filters[${filterIndex}]`),
  );

  if (values.length === 0) {
    throw new Error(`Local project ${index + 1} must include at least one filter.`);
  }

  return [...new Set(values)];
}

function resolveAssetPath(src) {
  const pathname = src.split("?")[0];
  const relativePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  return resolve(rootDir, "public", relativePath.replace(/^assets\//, "assets/"));
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

function assertObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
}

function readRequiredPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`Local field ${fieldName} must be a positive integer.`);
  }

  return value;
}

function readOptionalString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
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

function readErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error.";
}
