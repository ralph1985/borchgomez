import { LocalContentRepository } from "../../infrastructure/content/local-content-repository";
import {
  SanityContentRepository,
  type SanityContentConfig,
} from "../../infrastructure/content/sanity/sanity-content-repository";

const localContentRepository = new LocalContentRepository();

const sanityConfig = readSanityConfig();

export const contentRepository = sanityConfig
  ? new SanityContentRepository(localContentRepository, sanityConfig)
  : localContentRepository;

function readSanityConfig(): SanityContentConfig | null {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  const dataset = import.meta.env.SANITY_DATASET;
  const apiVersion = import.meta.env.SANITY_API_VERSION;

  if (!projectId || !dataset || !apiVersion) {
    return null;
  }

  return {
    projectId,
    dataset,
    apiVersion,
  };
}
