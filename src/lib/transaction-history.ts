export type HistoryKind = "deposit" | "withdrawal" | "rebalance";
export type HistoryStatus = "success" | "pending" | "failed";

export interface TransactionHistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  detail: string;
  amount: number | null;
  status: HistoryStatus;
  occurredAt: string;
  txHash: string | null;
}

export interface TransactionHistoryFilter {
  kind: HistoryKind | "all";
  status: HistoryStatus | "all";
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
}

export interface TransactionHistoryPage {
  items: TransactionHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 64-char hex Stellar transaction hashes (mock)
const MOCK_TX_HASHES: Record<string, string> = {
  t01: "a1b2c3d4e5f67890123456789012345678901234567890abcdef1234567890ab",
  t02: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
  t03: "c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef1234",
  t04: "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890cd",
  t05: "e5f6789012345678901234567890abcdef1234567890abcdef1234567890abcd",
  t06: "f678901234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  t07: "0123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  t08: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  t09: "234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
  t10: "34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
  t11: "4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
  t12: "567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345",
  t13: "67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
  t14: "7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567",
  t15: "890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
  t16: "90abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789",
};

export const MOCK_HISTORY_ITEMS: TransactionHistoryItem[] = [
  {
    id: "hist-001",
    kind: "deposit",
    title: "Deposit confirmed",
    detail: "USDC deposited from Freighter wallet and routed to Balanced strategy.",
    amount: 8500,
    status: "success",
    occurredAt: "2026-03-24T07:42:00.000Z",
    txHash: MOCK_TX_HASHES.t01,
  },
  {
    id: "hist-002",
    kind: "rebalance",
    title: "Auto-rebalance executed",
    detail: "Capital shifted from reserve into Blend lending after rate improvement.",
    amount: null,
    status: "success",
    occurredAt: "2026-03-24T05:16:00.000Z",
    txHash: MOCK_TX_HASHES.t02,
  },
  {
    id: "hist-003",
    kind: "withdrawal",
    title: "Withdrawal confirmed",
    detail: "Liquidity released and settled to destination wallet.",
    amount: -1200,
    status: "success",
    occurredAt: "2026-03-23T18:22:00.000Z",
    txHash: MOCK_TX_HASHES.t03,
  },
  {
    id: "hist-004",
    kind: "deposit",
    title: "Deposit pending",
    detail: "Transaction submitted, awaiting Stellar network confirmation.",
    amount: 3000,
    status: "pending",
    occurredAt: "2026-03-23T15:03:00.000Z",
    txHash: null,
  },
  {
    id: "hist-005",
    kind: "withdrawal",
    title: "Withdrawal failed",
    detail: "Treasury liquidity changed mid-flight. Please retry with updated amount.",
    amount: -500,
    status: "failed",
    occurredAt: "2026-03-22T11:44:00.000Z",
    txHash: null,
  },
  {
    id: "hist-006",
    kind: "deposit",
    title: "Deposit confirmed",
    detail: "USDC deposited and allocated to Stellar DEX LP position.",
    amount: 5000,
    status: "success",
    occurredAt: "2026-03-22T09:10:00.000Z",
    txHash: MOCK_TX_HASHES.t04,
  },
  {
    id: "hist-007",
    kind: "rebalance",
    title: "Auto-rebalance executed",
    detail: "Reserve topped up from DEX LP as APY spread narrowed.",
    amount: null,
    status: "success",
    occurredAt: "2026-03-21T22:31:00.000Z",
    txHash: MOCK_TX_HASHES.t05,
  },
  {
    id: "hist-008",
    kind: "withdrawal",
    title: "Withdrawal confirmed",
    detail: "Scheduled withdrawal settled to Freighter destination wallet.",
    amount: -2400,
    status: "success",
    occurredAt: "2026-03-21T14:05:00.000Z",
    txHash: MOCK_TX_HASHES.t06,
  },
  {
    id: "hist-009",
    kind: "deposit",
    title: "Deposit confirmed",
    detail: "Lump-sum deposit split across Blend lending and DEX liquidity.",
    amount: 12000,
    status: "success",
    occurredAt: "2026-03-20T19:50:00.000Z",
    txHash: MOCK_TX_HASHES.t07,
  },
  {
    id: "hist-010",
    kind: "rebalance",
    title: "Rebalance pending",
    detail: "Triggered by strategy drift; awaiting on-chain settlement.",
    amount: null,
    status: "pending",
    occurredAt: "2026-03-20T08:20:00.000Z",
    txHash: null,
  },
  {
    id: "hist-011",
    kind: "deposit",
    title: "Deposit confirmed",
    detail: "Small top-up deposited into protected reserve buffer.",
    amount: 750,
    status: "success",
    occurredAt: "2026-03-19T16:11:00.000Z",
    txHash: MOCK_TX_HASHES.t08,
  },
  {
    id: "hist-012",
    kind: "withdrawal",
    title: "Withdrawal confirmed",
    detail: "Emergency liquidity withdrawn after manual request.",
    amount: -4200,
    status: "success",
    occurredAt: "2026-03-19T09:33:00.000Z",
    txHash: MOCK_TX_HASHES.t09,
  },
  {
    id: "hist-013",
    kind: "deposit",
    title: "Deposit failed",
    detail: "Network fee estimate expired before submission. Refresh and retry.",
    amount: 1500,
    status: "failed",
    occurredAt: "2026-03-18T21:07:00.000Z",
    txHash: null,
  },
  {
    id: "hist-014",
    kind: "rebalance",
    title: "Auto-rebalance executed",
    detail: "Monthly strategy review triggered reallocation to growth positions.",
    amount: null,
    status: "success",
    occurredAt: "2026-03-18T06:00:00.000Z",
    txHash: MOCK_TX_HASHES.t10,
  },
  {
    id: "hist-015",
    kind: "withdrawal",
    title: "Withdrawal confirmed",
    detail: "Profit-taking withdrawal cleared same-day.",
    amount: -8800,
    status: "success",
    occurredAt: "2026-03-17T13:55:00.000Z",
    txHash: MOCK_TX_HASHES.t11,
  },
  {
    id: "hist-016",
    kind: "deposit",
    title: "Deposit confirmed",
    detail: "DCA deposit routed into Blend USDC lending pool.",
    amount: 2500,
    status: "success",
    occurredAt: "2026-03-17T07:30:00.000Z",
    txHash: MOCK_TX_HASHES.t12,
  },
  {
    id: "hist-017",
    kind: "rebalance",
    title: "Auto-rebalance executed",
    detail: "AQUA rewards reinvested into primary lending position.",
    amount: null,
    status: "success",
    occurredAt: "2026-03-16T20:18:00.000Z",
    txHash: MOCK_TX_HASHES.t13,
  },
  {
    id: "hist-018",
    kind: "withdrawal",
    title: "Withdrawal pending",
    detail: "Queued for same-day settlement; liquidity being freed.",
    amount: -650,
    status: "pending",
    occurredAt: "2026-03-16T12:40:00.000Z",
    txHash: null,
  },
  {
    id: "hist-019",
    kind: "deposit",
    title: "Deposit confirmed",
    detail: "Initial portfolio deposit routed to Balanced strategy.",
    amount: 20000,
    status: "success",
    occurredAt: "2026-03-15T10:00:00.000Z",
    txHash: MOCK_TX_HASHES.t14,
  },
  {
    id: "hist-020",
    kind: "withdrawal",
    title: "Withdrawal confirmed",
    detail: "Standard withdrawal settled to Stellar destination wallet.",
    amount: -3300,
    status: "success",
    occurredAt: "2026-03-14T15:22:00.000Z",
    txHash: MOCK_TX_HASHES.t15,
  },
  {
    id: "hist-021",
    kind: "rebalance",
    title: "Auto-rebalance executed",
    detail: "Quarterly rebalance to maintain Balanced strategy drift limits.",
    amount: null,
    status: "success",
    occurredAt: "2026-03-13T04:00:00.000Z",
    txHash: MOCK_TX_HASHES.t16,
  },
  {
    id: "hist-022",
    kind: "deposit",
    title: "Deposit failed",
    detail: "Wallet signature timed out. Funds were not debited — safe to retry.",
    amount: 200,
    status: "failed",
    occurredAt: "2026-03-12T18:55:00.000Z",
    txHash: null,
  },
];

export function parseHistoryKind(value: string | null): HistoryKind | "all" {
  if (value === "deposit" || value === "withdrawal" || value === "rebalance") {
    return value;
  }
  return "all";
}

export function parseHistoryStatus(value: string | null): HistoryStatus | "all" {
  if (value === "success" || value === "pending" || value === "failed") {
    return value;
  }
  return "all";
}

export function filterAndPaginateHistory(
  filter: TransactionHistoryFilter,
): TransactionHistoryPage {
  let items = MOCK_HISTORY_ITEMS.slice();

  if (filter.kind !== "all") {
    items = items.filter((item) => item.kind === filter.kind);
  }

  if (filter.status !== "all") {
    items = items.filter((item) => item.status === filter.status);
  }

  if (filter.dateFrom) {
    const from = new Date(filter.dateFrom).getTime();
    items = items.filter((item) => new Date(item.occurredAt).getTime() >= from);
  }

  if (filter.dateTo) {
    // include the full dateTo day
    const to = new Date(filter.dateTo);
    to.setDate(to.getDate() + 1);
    items = items.filter((item) => new Date(item.occurredAt).getTime() < to.getTime());
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / filter.pageSize));
  const clampedPage = Math.min(Math.max(1, filter.page), totalPages);
  const start = (clampedPage - 1) * filter.pageSize;
  const pageItems = items.slice(start, start + filter.pageSize);

  return {
    items: pageItems,
    total,
    page: clampedPage,
    pageSize: filter.pageSize,
    totalPages,
  };
}
