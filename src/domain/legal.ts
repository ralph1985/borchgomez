export interface LegalData {
  fullName: string;
  commercialName: string;
  domain: string;
  address: string;
  email: string;
  phone: string;
}

export interface LegalPageSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalPageContent {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalPageSection[];
}
