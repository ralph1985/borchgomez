export interface ContentImage {
  src: string;
  srcset?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description?: string;
  statusLabel?: string;
  statusText?: string;
  features?: string[];
  image?: ContentImage;
}
