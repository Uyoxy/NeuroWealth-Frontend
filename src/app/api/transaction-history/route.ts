import { NextRequest, NextResponse } from "next/server";
import {
  filterAndPaginateHistory,
  parseHistoryKind,
  parseHistoryStatus,
  TransactionHistoryFilter,
} from "@/lib/transaction-history";

export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const kind = parseHistoryKind(params.get("kind"));
  const status = parseHistoryStatus(params.get("status"));
  const dateFrom = params.get("dateFrom") ?? "";
  const dateTo = params.get("dateTo") ?? "";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(params.get("pageSize") ?? "10", 10) || 10),
  );

  const filter: TransactionHistoryFilter = {
    kind,
    status,
    dateFrom,
    dateTo,
    page,
    pageSize,
  };

  const result = filterAndPaginateHistory(filter);

  return NextResponse.json(result);
}
