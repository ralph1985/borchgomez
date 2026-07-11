export interface Plan {
  name: string;
  price: string;
  tagline: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  cta: {
    label: string;
    href: string;
  };
}

export interface PlansInfoBox {
  title: string;
  blocks: {
    title: string;
    points: string[];
  }[];
}

export interface PlansContent {
  intro: {
    title: string;
    subtitle: string;
  };
  items: Plan[];
  promo: {
    title: string;
    price?: string;
    description: string;
    features: string[];
    note: string;
  };
  infoBoxes: PlansInfoBox[];
  budgetNote: string;
}
