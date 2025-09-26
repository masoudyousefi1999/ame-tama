import { customFetch } from "@/lib/utils";

export async function getMe() {
  try {
    const res = await customFetch("/auth/me", {
      method: "GET",
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
