import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { IUser } from "@/components/admin/users/users-table";
import { UsersPageClient } from "@/components/admin/users/users-page-client";
import { customFetch } from "@/lib/utils";

const DEFAULT_LIMIT = 20;

interface UsersResponse {
  users: IUser[];
  total?: number;
  totalCount?: number;
}

async function getUsers(
  searchParams: Promise<{ page?: string; limit?: string }>
) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(DEFAULT_LIMIT), 10);

  const res = await customFetch(`/users?page=${page}&limit=${limit}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  const data = (await res.json()) as UsersResponse;
  return data;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(DEFAULT_LIMIT), 10);

  const response = await getUsers(searchParams);
  const users = response.users || [];
  const total = response.total || response.totalCount || users.length;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">کاربران</h1>
          <p className="text-gray-400 text-sm mt-1">{total} کاربر</p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Link href="/admin/users/new" prefetch={false}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن کاربر
          </Link>
        </Button>
      </div>

      <div className="bg-gray-800/80 rounded-lg border border-gray-700">
        <UsersPageClient
          initialUsers={users}
          initialTotal={total}
          initialPage={page}
          initialLimit={limit}
        />
      </div>
    </div>
  );
}
