"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_ROUTE_TITLE_ID } from "@/lib/app-landmarks";
import { usePathname } from "next/navigation";
import { getRouteLabel } from "@/lib/routeMetadata";
import { getUserInitials } from "@/lib/user";

export default function TopHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = getRouteLabel(pathname);

  return (
    <header
      className="
        fixed top-0 right-0 left-0
        md:left-64
        h-16 z-20
        bg-app-bg/80 backdrop-blur-sm
        border-b border-surface-border
        flex items-center justify-between
        px-4 md:px-6
      "
      role="banner"
    >
      {/* Left: Logo (mobile only) + page title */}
      <div className="flex items-center gap-3">
        {/* Page title */}
        <h1
          id={DASHBOARD_ROUTE_TITLE_ID}
          className="text-base font-semibold text-text-primary leading-none"
        >
          {title}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          className="btn-ghost relative w-9 h-9 flex items-center justify-center rounded-lg"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          {/* Notification badge */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"
            aria-hidden="true"
          />
        </button>

        {/* Avatar (mobile) */}
        <div
          className="md:hidden w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary"
          aria-hidden="true"
        >
          {user?.avatarInitials ?? getUserInitials(user?.displayName ?? "")}
        </div>
      </div>
    </header>
  );
}
