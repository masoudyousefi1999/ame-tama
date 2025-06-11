import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function customFetch(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${input}`, {
    credentials: "include",
    ...init,
  });
}
