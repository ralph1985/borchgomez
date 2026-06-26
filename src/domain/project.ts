import type { ContentImage } from "./service";

export interface Project {
  title: string;
  category: string;
  filter: string;
  image: ContentImage;
  link: {
    href: string;
    label: string;
  };
}
