import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const sizes = [640, 960, 1440, 1920];
  const size = sizes.find((candidate) => candidate >= width) ?? sizes.at(-1)!;
  return src.replace(/\.webp$/, `-${size}.webp`);
}
