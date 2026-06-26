import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { singletonStructure } from "./structure";

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset = import.meta.env.SANITY_STUDIO_DATASET;

if (!projectId || !dataset) {
  throw new Error("Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET.");
}

export default defineConfig({
  name: "borchgomez",
  title: "Borja Gómez CMS",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: singletonStructure,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (previousActions, context) => {
      if (context.schemaType === "purpose") {
        return previousActions.filter(({ action }) => action && !["delete", "duplicate", "unpublish"].includes(action));
      }

      return previousActions;
    },
  },
});
