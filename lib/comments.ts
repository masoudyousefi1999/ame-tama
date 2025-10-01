import { customFetch } from "./utils";

export interface ProductComment {
  uuid: string;
  productId: string; // product uuid
  user?: { uuid?: string; firstName?: string; lastName?: string } | null;
  text: string;
  createdAt: string;
}

export async function getCommentsByProductId(
  productId: string
): Promise<ProductComment[]> {
  try {
    const res = await customFetch(
      `/comment/${productId}`,
      {
        method: "GET",
        next: { revalidate: 120, tags: ["comments", `comments-${productId}`] },
      } as any
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createComment(input: {
  productId: string;
  text: string;
}): Promise<ProductComment | null> {
  try {
    const res = await customFetch(`/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: input.productId, text: input.text }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}
