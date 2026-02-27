import dynamic from "next/dynamic";
import { Suspense } from "react";

const SettingsContent = dynamic(
  () => import("@/components/profile/settings-content"),
  {
    ssr: true,
    loading: () => (
      <div className="container py-8 lg:mt-20 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    ),
  }
);

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-8 lg:mt-20 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
