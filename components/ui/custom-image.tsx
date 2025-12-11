import NextImage from "next/image";
import type { ImageProps, StaticImageData, ImageLoaderProps } from "next/image";

// Export types so callers can keep their existing type imports.
export type { ImageProps, StaticImageData, ImageLoaderProps };

function CustomImage(props: ImageProps) {
  return <NextImage {...props} />;
}

CustomImage.displayName = "CustomImage";

export default CustomImage;
