import { TagForm } from "@/components/admin/tags/tag-form";
import { customFetch } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ITagType } from "@/lib/tags";

/**
 * Fetch tag data from API using UUID
 */
async function getTag(uuid: string): Promise<ITagType> {
  try {
    const response = await customFetch(`/tag/uuid/${uuid}`, {
      method: "GET",
      next: { tags: ["tag", uuid] },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch tag: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tag:", error);
    notFound();
  }
}

export default async function EditTagPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const tag = await getTag(uuid);

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ویرایش انیمه</h1>
        <p className="text-muted-foreground text-sm mt-1">{tag.name}</p>
      </div>

      <TagForm tag={tag} />
    </div>
  );
}

