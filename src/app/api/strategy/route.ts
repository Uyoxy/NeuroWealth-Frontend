import { NextRequest, NextResponse } from "next/server";
import {
  parseStrategyKind,
  StrategyKind,
  StrategyPreference,
  StrategyUpdatePayload,
} from "@/lib/strategies";

// In-memory store for the demo/fallback path.
// Resets on server restart; the client layer mirrors to localStorage for persistence.
let mockPreference: StrategyKind | null = null;

function resolveEndpoint(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalizedPath, normalizedBase).toString();
}

export async function GET(request: NextRequest) {
  const apiBaseUrl = process.env.NEUROWEALTH_API_BASE_URL;
  const strategyPath =
    process.env.NEUROWEALTH_STRATEGY_PATH ?? "/strategy/preference";

  if (apiBaseUrl) {
    try {
      const res = await fetch(resolveEndpoint(apiBaseUrl, strategyPath), {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const data = (await res.json()) as StrategyPreference;
        return NextResponse.json(data, {
          headers: { "Cache-Control": "no-store" },
        });
      }
    } catch {
      // fall through to mock
    }
  }

  // Provide the in-memory default. Clients may override via localStorage.
  const body: StrategyPreference = { strategy: mockPreference };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: NextRequest) {
  const apiBaseUrl = process.env.NEUROWEALTH_API_BASE_URL;
  const strategyPath =
    process.env.NEUROWEALTH_STRATEGY_PATH ?? "/strategy/preference";

  const payload = (await request.json()) as Partial<StrategyUpdatePayload>;
  const strategy = parseStrategyKind(payload.strategy ?? null);

  if (!strategy) {
    return NextResponse.json(
      { message: "Invalid strategy value. Must be conservative, balanced, or growth." },
      { status: 422 },
    );
  }

  if (apiBaseUrl) {
    try {
      const res = await fetch(resolveEndpoint(apiBaseUrl, strategyPath), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ strategy }),
        cache: "no-store",
      });

      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: {
          "Content-Type": res.headers.get("Content-Type") ?? "application/json",
          "Cache-Control": "no-store",
        },
      });
    } catch {
      // fall through to mock
    }
  }

  // Mock: persist in memory and respond with the updated preference.
  mockPreference = strategy;
  const body: StrategyPreference = { strategy };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}
