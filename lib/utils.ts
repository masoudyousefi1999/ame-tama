import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CustomFetchOptions = RequestInit & {
  cookies?: string;
};

export async function customFetch(
  input: string | URL | globalThis.Request,
  init?: CustomFetchOptions
): Promise<Response> {
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT_SERVER! // e.g. https://api.example.com
    : process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT_CLIENT!; // e.g. /api or ''

  const url = typeof input === "string" ? `${baseUrl}${input}` : input;

  console.log("url: ", url);

  const headers = new Headers(init?.headers || {});

  // ست کردن کوکی‌ها در سرور (از جمله middleware یا API)
  if (isServer && init?.cookies) {
    headers.set("cookie", init.cookies);
  }

  return fetch(url, {
    credentials: "include",
    ...init,
    headers,
  });
}
