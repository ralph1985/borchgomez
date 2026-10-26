import type { ContentImage } from "./service";

export interface Project {
  title: string;
  subtitle?: string;
  category: string;
  filter?: string;
  filters?: string[];
  image?: ContentImage;
  link: {
    href: string;
    label: string;
  };
}
