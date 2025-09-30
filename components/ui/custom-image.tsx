import Image, { type ImageProps } from "next/image";

type OutputFormat = "webp" | "avif" | "jpeg" | "jpg" | "png";
type ResizeFit = "cover" | "contain" | "fill" | "inside" | "outside";

export interface CustomImageProps extends Omit<ImageProps, "loader" | "src"> {
  src: string;
  format?: OutputFormat;
  fit?: ResizeFit;
  background?: string;
  backendPath?: string;
}

function isLocal(src: string): boolean {
  return src.startsWith("/") || src.startsWith("data:");
}

export function CustomImage({
  src,
  format,
  fit,
  background,
  backendPath,
  quality,
  width,
  height,
  ...rest
}: CustomImageProps) {
  if (isLocal(src)) {
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

  const endpointBase =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT ||
    "https://api.ame-tama.com";

  const cleanedBase = endpointBase.replace(/\/+$/, "");
  const basePath = `${cleanedBase}/image`;
  const bg = background ? String(background).replace(/^#/, "") : undefined;

  const loader = ({
    src: originalSrc,
    width: w,
    quality: q,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    const params = new URLSearchParams();
    params.set("url", originalSrc);
    params.set("w", String(w));
    if (typeof height === "number") params.set("h", String(height));
    const resolvedQuality = typeof q === "number" ? q : quality;
    if (typeof resolvedQuality === "number")
      params.set("q", String(resolvedQuality));
    if (format) params.set("f", format);
    if (fit) params.set("fit", fit);
    if (bg) params.set("bg", bg);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <Image
      src={src}
      loader={loader}
      quality={quality}
      width={width}
      height={height}
      {...rest}
    />
  );
}
