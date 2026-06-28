import type { ContentImage } from "./service";

interface FaviconLink {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
}

export interface SiteSettings {
  lang: string;
  title: string;
  description: string;
  metadata: Record<string, string>;
  assets: {
    stylesheets: string[];
    scripts: string[];
    fontPreloads: string[];
    favicons: FaviconLink[];
  };
  brand: {
    label: string;
    logo: ContentImage;
  };
  nav: Array<{ label: string; href: string }>;
  serviceMenuFeatures: string[];
  socialLinks: Array<{ type: string; href: string; label: string }>;
  hero: {
    greeting: string;
    title: string;
    career: string;
    description: string;
    claims: string[];
    actions: Array<{ label: string; href: string; className: string }>;
    image: ContentImage;
  };
  purpose: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; text: string }>;
    closing: string;
  };
  servicesIntro: { title: string; subtitle: string };
  projectsIntro: {
    title: string;
    subtitle: string;
    filters: Array<{ label: string; value: string }>;
  };
  instagram: {
    title: string;
    subtitle: string;
    previews: Array<{ href: string; ariaLabel: string; image: ContentImage }>;
    cta: { label: string; href: string };
  };
  about: {
    title: string;
    subtitle: string;
    paragraphsBeforeImage: string[];
    image: ContentImage;
    paragraphsAfterImage: string[];
  };
  contact: {
    title: string;
    subtitle: string;
    primary: { label: string; href: string };
    phone: { label: string; href: string };
    email: { label: string; href: string };
    instagram: { label: string; href: string };
  };
  footer: { copy: string };
}
