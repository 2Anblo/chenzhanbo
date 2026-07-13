export const R2_BASE_URL =
  "https://pub-785f227a39b640f68a45a4515baf5701.r2.dev";

export function assetUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  return `${R2_BASE_URL}/${path}`;
}
