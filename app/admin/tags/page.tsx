import { TagsTable } from "@/components/admin/tags/tags-table";
import { customFetch } from "@/lib/utils";
import { ITagType } from "@/lib/tags";

async function fetchTagByUuid(uuid: string): Promise<ITagType | null> {
  try {
    const response = await customFetch(`/tag/uuid/${uuid}`, {
      method: "GET",
      next: { tags: ["tag", uuid] },
    });

    if (!response.ok) {
      console.error(`Failed to fetch tag ${uuid}: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching tag ${uuid}:`, error);
    return null;
  }
}

export default async function TagsPage() {
  try {
    // First, fetch the list of tags
    const res = await customFetch("/tag");
    const data = await res.json();

    let tagsList: ITagType[] = [];

    if (data?.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      // Check if tags array contains full tag objects
      if (data.tags[0]?.uuid && data.tags[0]?.name) {
        // Already full tag objects
        tagsList = data.tags as ITagType[];
      } else {
        // Extract UUIDs from the list (could be strings or objects with uuid property)
        const uuids: string[] = [];

        data.tags.forEach((tag: any) => {
          if (typeof tag === "string") {
            uuids.push(tag);
          } else if (tag?.uuid) {
            uuids.push(tag.uuid);
          }
        });

        // Fetch each tag by UUID using /tag/uuid/{uuid}
        if (uuids.length > 0) {
          const tagPromises = uuids.map((uuid: string) => fetchTagByUuid(uuid));
          const fetchedTags = await Promise.all(tagPromises);
          tagsList = fetchedTags.filter((tag): tag is ITagType => tag !== null);
        }
      }
    }

    return (
      <div className="space-y-4" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">انیمه‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {tagsList.length} انیمه
          </p>
        </div>

        <TagsTable initialTags={tagsList} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching tags:", error);
    return (
      <div className="space-y-4" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">انیمه‌ها</h1>
          <p className="text-muted-foreground text-sm mt-1">
            خطا در بارگذاری انیمه‌ها
          </p>
        </div>
        <div className="text-destructive">
          Error fetching tags. Please try again later.
        </div>
      </div>
    );
  }
}
