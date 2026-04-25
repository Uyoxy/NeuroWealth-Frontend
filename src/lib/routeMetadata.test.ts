import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  buildBreadcrumbsFromPath,
  getRouteLabel,
  routeMetadata,
} from "@/lib/routeMetadata";

function collectDashboardPageRoutes(directory: string): string[] {
  const routes: string[] = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      routes.push(...collectDashboardPageRoutes(entryPath));
      continue;
    }

    if (!entry.isFile() || entry.name !== "page.tsx") {
      continue;
    }

    const relativeDir = path.relative(
      path.join(process.cwd(), "src/app"),
      path.dirname(entryPath),
    );

    const segments = relativeDir
      .split(path.sep)
      .filter(Boolean)
      .filter((segment) => !segment.startsWith("("));

    routes.push(`/${segments.join("/")}`);
  }

  return routes.sort();
}

test("routeMetadata covers every dashboard page route and avoids stale entries", () => {
  const dashboardRoutes = collectDashboardPageRoutes(
    path.join(process.cwd(), "src/app/dashboard"),
  );

  const missing = dashboardRoutes.filter((route) => !routeMetadata[route]);
  const stale = Object.keys(routeMetadata)
    .filter((route) => route.startsWith("/dashboard"))
    .filter((route) => !dashboardRoutes.includes(route))
    .sort();

  assert.deepEqual(missing, []);
  assert.deepEqual(stale, []);
});

test("route labels and breadcrumbs come from the shared route metadata", () => {
  assert.equal(getRouteLabel("/dashboard/settings/security"), "Security");
  assert.equal(getRouteLabel("/dashboard/missing"), "Dashboard");

  const breadcrumbs = buildBreadcrumbsFromPath("/dashboard/settings/security");
  assert.deepEqual(
    breadcrumbs.map((item) => item.label),
    ["Home", "Dashboard", "Settings", "Security"],
  );
});
