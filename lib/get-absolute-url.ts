/**
 * Converts a relative path to an absolute URL using the site's base URL
 * @param path - The relative path (should start with /)
 * @returns The absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  // Use the environment variable, or fallback to a default for development
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com"

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}
