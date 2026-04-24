import assert from "node:assert/strict";
import test from "node:test";

import { setActiveLocale } from "@/lib/i18n/locale-state";
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
  formatSignedPercent,
  formatSyncLabel,
} from "@/lib/formatters";

test("formatCurrency and formatSignedCurrency follow the active locale", () => {
  setActiveLocale("en");
  assert.equal(formatCurrency(1234.5), "$1,234.50");
  assert.equal(formatSignedCurrency(1234.5), "+$1,234.50");
  assert.equal(formatSignedCurrency(-1234.5), "-$1,234.50");

  setActiveLocale("fr");
  assert.equal(
    formatCurrency(1234.5),
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(1234.5),
  );
});

test("formatPercent helpers keep signs stable", () => {
  setActiveLocale("en");
  assert.equal(formatPercent(8.44), "8.4%");
  assert.equal(formatSignedPercent(8.44), "+8.4%");
  assert.equal(formatSignedPercent(-8.44), "-8.4%");
  assert.equal(formatSignedPercent(0), "0.0%");
});

test("formatSyncLabel switches its prefix with the active locale", () => {
  const value = "2026-01-02T15:04:00.000Z";

  setActiveLocale("en");
  assert.match(formatSyncLabel(value), /^Updated /);

  setActiveLocale("fr");
  assert.match(formatSyncLabel(value), /^Mis à jour /);
});
