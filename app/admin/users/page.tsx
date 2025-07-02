import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IUser, UsersTable } from "@/components/admin/users/users-table";
import { customFetch } from "@/lib/utils";
import { headers } from "next/headers";

async function getUsers(searchParams: { page?: string; limit?: string }) {
  const page = Number.parseInt(searchParams.page || "1");
  const limit = Number.parseInt(searchParams.limit || "10");

  const cookie = (await headers()).get("cookie");

  const res = await customFetch("/users", {
    headers: {
      cookie: cookie ?? "",
    },
  });

  const users = await res.json();
  return users;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const users = (await getUsers(searchParams)) as IUser[];

  const data = { users, total: users.length, page: 1, limit: 10 };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            کاربران
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت حساب‌های کاربری و مجوزها
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full"
        >
          <Link href="/admin/users/new">
            <Plus className="ml-2 h-4 w-4" />
            افزودن کاربر
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <UsersTable data={data} />
      </div>
    </div>
  );
}
