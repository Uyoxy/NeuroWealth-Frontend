"use client";

import dynamic from "next/dynamic";
import { SkeletonCircle } from "@/components/ui/Skeleton";

import { ComponentProps } from "react";
import { DonutChartWrapper } from "@/components/charts/DonutChartWrapper";

// Dynamically load the DonutChartWrapper with a skeleton fallback
export const AllocationChart = dynamic<ComponentProps<typeof DonutChartWrapper>>(
  () => import("@/components/charts/DonutChartWrapper").then((mod) => mod.DonutChartWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-4">
        <SkeletonCircle size={180} />
      </div>
    ),
  }
);
