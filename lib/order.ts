import { customFetch } from "./utils";

export async function getUserOrder() {
  try {
    const res = await customFetch("/order", {
      method: "GET",
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

    const order = await res.json();

    if (order) {
      return order;
    }

    return;
  } catch (error) {
    return;
  }
}
