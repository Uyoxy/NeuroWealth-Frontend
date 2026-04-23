import {
  buildPendingTransaction,
  buildTransactionQuote,
  parseTransactionKind,
  TransactionRequestPayload,
  validateTransactionValues,
} from "@/lib/transactions";
import {
  ERROR_CODE,
  HTTP_STATUS,
  errorResponse,
  successResponse,
} from "@/lib/api-response";
import { NextResponse } from "next/server";

function resolveEndpoint(baseUrl: string, pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = pathOrUrl.startsWith("/")
    ? pathOrUrl.slice(1)
    : pathOrUrl;

  return new URL(normalizedPath, normalizedBase).toString();
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<TransactionRequestPayload>;
  const kind = parseTransactionKind(payload.kind ?? null);
  const values = payload.values ?? {
    amount: "",
    walletAddress: "",
    walletConnected: false,
  };
  const apiBaseUrl = process.env.NEUROWEALTH_API_BASE_URL;
  const transactionPath =
    process.env.NEUROWEALTH_TRANSACTIONS_PATH ?? "/transactions";

  if (apiBaseUrl) {
    try {
      const response = await fetch(
        resolveEndpoint(apiBaseUrl, transactionPath),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...payload,
            kind,
            values,
          }),
          cache: "no-store",
        },
      );

      const text = await response.text();

      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ?? "application/json",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Backend request failed";

      return NextResponse.json(
        errorResponse(
          ERROR_CODE.BACKEND_ERROR,
          "Transaction service temporarily unavailable",
          { details: message },
        ),
        { status: HTTP_STATUS.SERVICE_UNAVAILABLE },
      );
    }
  }

  const errors = validateTransactionValues(kind, values);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      errorResponse(
        ERROR_CODE.VALIDATION_ERROR,
        "Fix the highlighted fields and try again.",
        errors,
      ),
      { status: HTTP_STATUS.UNPROCESSABLE_ENTITY },
    );
  }

  if (payload.intent === "submit") {
    const outcome = payload.simulation === "failure" ? "failure" : "success";

    return NextResponse.json(
      successResponse({
        pending: buildPendingTransaction(kind, values, outcome),
      }),
    );
  }

  return NextResponse.json(
    successResponse({
      quote: buildTransactionQuote(kind, values),
    }),
  );
}
