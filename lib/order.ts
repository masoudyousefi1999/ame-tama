import { customFetch } from "./utils";

export async function getUserOrder() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "GET",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
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
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const res = await fetch(`${baseUrl}/api/orders/increase`, {
      method: "POST",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
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
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const res = await fetch(`${baseUrl}/api/orders/decrease`, {
      method: "POST",
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
    return;
  }
}
