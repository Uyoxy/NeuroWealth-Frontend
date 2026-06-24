import assert from "node:assert/strict";
import test from "node:test";

import {
  applyColumnFilters,
  ariaSortValue,
  compareValues,
  cycleSortDirection,
  distinctValues,
  filterRows,
  sortRows,
} from "./dataTable.utils";

interface Row {
  name: string;
  amount: number;
  status: string;
}

const rows: Row[] = [
  { name: "Item 10", amount: 250, status: "Pending" },
  { name: "Item 2", amount: 1000, status: "Completed" },
  { name: "item 1", amount: 50, status: "Completed" },
  { name: "Item 3", amount: 50, status: "Failed" },
];

test("cycleSortDirection cycles none → asc → desc → none", () => {
  assert.equal(cycleSortDirection(null), "asc");
  assert.equal(cycleSortDirection("asc"), "desc");
  assert.equal(cycleSortDirection("desc"), null);
});

test("compareValues sorts numbers numerically and strings naturally", () => {
  assert.ok(compareValues(2, 10) < 0);
  // "Item 2" should come before "Item 10" with numeric-aware compare
  assert.ok(compareValues("Item 2", "Item 10") < 0);
  // case-insensitive
  assert.equal(compareValues("item", "ITEM"), 0);
  // nullish treated as lowest
  assert.ok(compareValues(null, "a") < 0);
});

test("sortRows ascending and descending by a numeric accessor", () => {
  const asc = sortRows(rows, (r) => r.amount, "asc").map((r) => r.amount);
  assert.deepEqual(asc, [50, 50, 250, 1000]);

  const desc = sortRows(rows, (r) => r.amount, "desc").map((r) => r.amount);
  assert.deepEqual(desc, [1000, 250, 50, 50]);
});

test("sortRows with null direction returns an unmodified copy", () => {
  const result = sortRows(rows, (r) => r.amount, null);
  assert.notEqual(result, rows); // new array
  assert.deepEqual(result, rows); // same order
});

test("sortRows is stable for equal keys", () => {
  // Two rows share amount 50: "item 1" (index 2) then "Item 3" (index 3).
  const asc = sortRows(rows, (r) => r.amount, "asc")
    .filter((r) => r.amount === 50)
    .map((r) => r.name);
  assert.deepEqual(asc, ["item 1", "Item 3"]);
});

test("filterRows matches case-insensitively across values and passes through empty query", () => {
  const all = filterRows(rows, "", (r) => [r.name, r.amount, r.status]);
  assert.equal(all.length, 4);

  const completed = filterRows(rows, "complete", (r) => [r.name, r.status]);
  assert.equal(completed.length, 2);

  const byAmount = filterRows(rows, "1000", (r) => [r.name, r.amount]);
  assert.deepEqual(byAmount.map((r) => r.name), ["Item 2"]);
});

test("applyColumnFilters AND-combines active filters and ignores 'all'/empty", () => {
  const accessors = { status: (r: Row) => r.status };

  assert.equal(
    applyColumnFilters(rows, { status: "all" }, accessors).length,
    4,
  );
  assert.equal(applyColumnFilters(rows, {}, accessors).length, 4);

  const completed = applyColumnFilters(rows, { status: "Completed" }, accessors);
  assert.deepEqual(completed.map((r) => r.name), ["Item 2", "item 1"]);
});

test("distinctValues returns sorted unique strings", () => {
  assert.deepEqual(distinctValues(rows, (r) => r.status), [
    "Completed",
    "Failed",
    "Pending",
  ]);
});

test("ariaSortValue reflects active column + direction", () => {
  assert.equal(ariaSortValue(true, "asc"), "ascending");
  assert.equal(ariaSortValue(true, "desc"), "descending");
  assert.equal(ariaSortValue(false, "asc"), "none");
  assert.equal(ariaSortValue(true, null), "none");
});
