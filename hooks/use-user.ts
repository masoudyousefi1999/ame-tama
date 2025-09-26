import { customFetch } from "@/lib/utils";

export async function getMe() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/user/me`, {
      method: "GET",
      credentials: "include", // Include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const user = await res.json();
    if (user && !user.error) {
      return user;
    }

    return null;
  } catch (error) {
    return null;
  }
}
