import type { ContentImage } from "../../domain/service";

export function imageAttrs(image: ContentImage) {
  return {
    src: image.src,
    srcset: image.srcset,
    sizes: image.sizes,
    alt: image.alt,
    width: image.width,
    height: image.height,
  };
}
