import assert from "node:assert/strict";
import test from "node:test";

import {
  filterByDateRange,
  filterByTimeRange,
  type DateFilterable,
} from "@/hooks/useDateFilter";

const sampleDates: Array<DateFilterable & { id: string }> = [
  { id: "older", date: "2026-01-02T10:00:00.000Z" },
  { id: "middle", date: new Date("2026-01-03T12:00:00.000Z") },
  { id: "newer", date: "2026-01-04T18:30:00.000Z" },
  { id: "invalid", date: "not-a-date" },
];

test("filterByDateRange keeps items inside the selected day bounds", () => {
  const filtered = filterByDateRange(sampleDates, {
    start: new Date("2026-01-03T00:00:00.000Z"),
    end: new Date("2026-01-04T00:00:00.000Z"),
  });

  assert.deepEqual(
    filtered.map((item) => item.id),
    ["middle", "newer", "invalid"],
  );
});

test("filterByDateRange returns the original list when no bounds are set", () => {
  const filtered = filterByDateRange(sampleDates, { start: null, end: null });
  assert.equal(filtered, sampleDates);
});

test("filterByTimeRange applies inclusive minute bounds", () => {
  const filtered = filterByTimeRange(
    [
      { id: "early", time: "08:15" },
      { id: "window-start", time: "09:00" },
      { id: "window-end", time: "11:30" },
      { id: "late", time: "12:05" },
    ],
    { hours: 9, minutes: 0 },
    { hours: 11, minutes: 30 },
  );

  assert.deepEqual(
    filtered.map((item) => item.id),
    ["window-start", "window-end"],
  );
});
