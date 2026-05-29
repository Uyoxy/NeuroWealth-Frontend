import { SettingsSectionSkeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-6 animate-fade-in" aria-busy="true" aria-label="Loading settings">
      {[1, 2, 3].map((section) => (
        <SettingsSectionSkeleton key={section} rows={2} />
      ))}
    </div>
  );
}
