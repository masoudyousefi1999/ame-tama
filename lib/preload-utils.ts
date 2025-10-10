/**
 * Utility functions for managing image preloads
 */

/**
 * Clean up unused preload links that haven't been used within a specified time
 */
export function cleanupUnusedPreloads(timeoutMs: number = 5000) {
  const preloadLinks = document.querySelectorAll(
    'link[rel="preload"][as="image"]'
  );

  preloadLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    // Check if the image is actually being used
    const imgElements = document.querySelectorAll(`img[src="${href}"]`);
    const isUsed = imgElements.length > 0;

    if (!isUsed) {
      // Set a timeout to remove the preload if not used
      setTimeout(() => {
        const stillExists = document.contains(link);
        const stillUnused =
          document.querySelectorAll(`img[src="${href}"]`).length === 0;

        if (stillExists && stillUnused) {
          link.remove();
        }
      }, timeoutMs);
    }
  });
}

/**
 * Check if a preload link already exists for a given URL
 */
export function hasPreloadLink(url: string): boolean {
  return document.querySelector(`link[rel="preload"][href="${url}"]`) !== null;
}

/**
 * Remove a specific preload link by URL
 */
export function removePreloadLink(url: string): void {
  const link = document.querySelector(`link[rel="preload"][href="${url}"]`);
  if (link) {
    link.remove();
  }
}

/**
 * Add a preload link with proper attributes
 */
export function addPreloadLink(
  url: string,
  options: {
    type?: string;
    priority?: boolean;
    onload?: () => void;
  } = {}
): HTMLLinkElement | null {
  if (hasPreloadLink(url)) {
    return null; // Already exists
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = "image";

  if (options.type) {
    link.type = options.type;
  }

  if (options.priority) {
    link.setAttribute("fetchpriority", "high");
  }

  if (options.onload) {
    link.onload = options.onload;
  }

  document.head.appendChild(link);
  return link;
}



