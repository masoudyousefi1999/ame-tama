import { customFetch } from "@/lib/utils";

export async function getMe() {
  try {
    const res = await customFetch("/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const user = await res.json();
    if (user) {
      return user;
    }

    return null;
  } catch (error) {
    return null;
  }
}
