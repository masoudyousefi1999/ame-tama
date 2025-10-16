import type React from "react";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <AdminHeader />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:pr-64 pt-16">
        <main className="py-6 md:py-8 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
