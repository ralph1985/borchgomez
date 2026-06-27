import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Missing SANITY_PROJECT_ID/SANITY_DATASET or SANITY_STUDIO_PROJECT_ID/SANITY_STUDIO_DATASET.");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "e8c6aapy0pgyxnb3nk4muyw2",
  },
});
