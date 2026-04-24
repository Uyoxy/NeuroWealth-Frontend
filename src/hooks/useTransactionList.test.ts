import assert from "node:assert/strict";
import test from "node:test";

import {
  MOCK_TRANSACTIONS,
  buildFilterOptions,
  filterTransactions,
  paginateTransactions,
} from "@/hooks/useTransactionList";

test("buildFilterOptions counts each filter group from the data set", () => {
  const options = buildFilterOptions(MOCK_TRANSACTIONS);
  const completed = options.find((option) => option.id === "status:completed");
  const deposit = options.find((option) => option.id === "type:deposit");

  assert.ok(completed);
  assert.equal(
    completed.count,
    MOCK_TRANSACTIONS.filter((transaction) => transaction.status === "completed")
      .length,
  );

  assert.ok(deposit);
  assert.equal(
    deposit.count,
    MOCK_TRANSACTIONS.filter((transaction) => transaction.type === "deposit")
      .length,
  );
});

test("filterTransactions combines status and type filters", () => {
  const filtered = filterTransactions(MOCK_TRANSACTIONS, [
    "status:completed",
    "type:deposit",
  ]);

  assert.ok(filtered.length > 0);
  assert.ok(
    filtered.every(
      (transaction) =>
        transaction.status === "completed" &&
        transaction.type === "deposit",
    ),
  );
});

test("paginateTransactions slices the requested page", () => {
  const pageOne = paginateTransactions(MOCK_TRANSACTIONS, 1, 5);
  const pageTwo = paginateTransactions(MOCK_TRANSACTIONS, 2, 5);

  assert.equal(pageOne.length, 5);
  assert.equal(pageTwo.length, 5);
  assert.notDeepEqual(pageOne, pageTwo);
  assert.deepEqual(pageTwo, MOCK_TRANSACTIONS.slice(5, 10));
});
