import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extend to support Next.js caching options on the server
// next: { revalidate, tags } and cache are forwarded to fetch
// cookies can be forwarded when running on the server

type CustomFetchOptions = RequestInit & {
  cookies?: string;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export async function customFetch(
  input: string | URL | globalThis.Request,
  init?: CustomFetchOptions
): Promise<Response> {
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL_SERVER!
    : process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT!;
  const url = typeof input === "string" ? `${baseUrl}${input}` : input;

  const headers = new Headers(init?.headers || {});

  if (isServer && init?.cookies) {
    headers.set("cookie", init.cookies);
  }

  return fetch(url, {
    credentials: "same-origin", // Use same-origin instead of include to avoid third-party cookies
    ...init,
    headers,
    // Ensure Next.js caching options pass through
    next: init?.next,
  });
}
