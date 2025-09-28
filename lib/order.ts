import { customFetch } from "./utils";
import { handleApiError, shouldLogError } from "./error-handler";

export async function getUserOrder() {
  try {
    const res = await customFetch("/order", {
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
        console.error("Unexpected error in getUserOrder:", error);
      }
      return;
    }

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
    // Handle network errors silently
    const apiError = handleApiError(error);
    if (shouldLogError(apiError)) {
      console.error("Unexpected error in getUserOrder:", apiError);
    }
    return;
  }
}

export async function increaseOrderItem({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  try {
    const res = await customFetch("/order/increase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (!res.ok) {
      // Handle expected errors silently
      const error = handleApiError({
        status: res.status,
        message: res.statusText,
      });
      if (shouldLogError(error)) {
        console.error("Unexpected error in increaseOrderItem:", error);
      }
      return;
    }

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
    // Handle network errors silently
    const apiError = handleApiError(error);
    if (shouldLogError(apiError)) {
      console.error("Unexpected error in increaseOrderItem:", apiError);
    }
    return;
  }
}

export async function decreaseOrderItem({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  try {
    const res = await customFetch("/order/decrease", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (!res.ok) {
      // Handle expected errors silently
      const error = handleApiError({
        status: res.status,
        message: res.statusText,
      });
      if (shouldLogError(error)) {
        console.error("Unexpected error in decreaseOrderItem:", error);
      }
      return;
    }

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
    // Handle network errors silently
    const apiError = handleApiError(error);
    if (shouldLogError(apiError)) {
      console.error("Unexpected error in decreaseOrderItem:", apiError);
    }
    return;
  }
}
