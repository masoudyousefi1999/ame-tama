import Image, { type ImageProps } from "next/image";

export interface CustomImageProps extends Omit<ImageProps, "loader"> {
  src: string;
}

export function CustomImage({
  src,
  quality,
  width,
  height,
  ...rest
}: CustomImageProps) {
  return (
    <Image
      src={src}
      quality={quality}
      width={width}
      height={height}
      {...rest}
    />
  );
}
