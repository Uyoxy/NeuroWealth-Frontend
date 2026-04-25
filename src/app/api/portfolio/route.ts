import {
  buildScenarioPayload,
  normalizePortfolioPayload,
  parseScenario,
} from "@/lib/portfolio";
import {
  ERROR_CODE,
  HTTP_STATUS,
  errorResponse,
  successResponse,
} from "@/lib/api-response";
import { portfolioQuerySchema, zodErrorToDetails } from "@/lib/validation/api";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const parsedQuery = portfolioQuerySchema.safeParse({
    scenario: request.nextUrl.searchParams.get("scenario") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      errorResponse(
        ERROR_CODE.VALIDATION_ERROR,
        "Query validation failed.",
        zodErrorToDetails(parsedQuery.error),
      ),
      { status: HTTP_STATUS.BAD_REQUEST },
    );
  }

  const scenario = parseScenario(parsedQuery.data.scenario ?? null);
  const apiBaseUrl = process.env.NEUROWEALTH_API_BASE_URL;
  const portfolioPath =
    process.env.NEUROWEALTH_PORTFOLIO_PATH ?? "/portfolio/overview";

  // Handle all sandbox scenarios
  if (scenario !== "live") {
    return NextResponse.json(successResponse(buildScenarioPayload(scenario)), {
      headers: {
        "Cache-Control": "no-store",
        "x-neurowealth-source": "demo",
      },
    });
  }

  if (!apiBaseUrl) {
    return NextResponse.json(successResponse(buildScenarioPayload("live")), {
      headers: {
        "Cache-Control": "no-store",
        "x-neurowealth-source": "demo",
      },
    });
  }

  try {
    const response = await fetch(resolveEndpoint(apiBaseUrl, portfolioPath), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Portfolio endpoint returned ${response.status}`);
    }

    const payload = normalizePortfolioPayload(await response.json(), "api");

    return NextResponse.json(successResponse(payload), {
      headers: {
        "Cache-Control": "no-store",
        "x-neurowealth-source": payload.source,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch portfolio data";

    return NextResponse.json(
      errorResponse(
        ERROR_CODE.SERVICE_UNAVAILABLE,
        "Portfolio service temporarily unavailable. Showing preview data.",
        { details: message },
      ),
      {
        status: HTTP_STATUS.SERVICE_UNAVAILABLE,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
