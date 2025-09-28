import { customFetch } from "@/lib/utils";
import { handleApiError, shouldLogError } from "@/lib/error-handler";

export async function getMe() {
  try {
    const res = await customFetch("/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // Handle expected errors silently
      const error = handleApiError({
        status: res.status,
        message: res.statusText,
      });
      if (shouldLogError(error)) {
        console.error("Unexpected error in getMe:", error);
      }
      return null;
    }

    const user = await res.json();
    if (user && !user.error) {
      return user;
    }

    return null;
  } catch (error) {
    // Handle network errors silently
    const apiError = handleApiError(error);
    if (shouldLogError(apiError)) {
      console.error("Unexpected error in getMe:", apiError);
    }
    return null;
  }
}
