/**
 * Typed environment variable access with validation.
 * Validates all required environment variables at startup.
 * Add all NEXT_PUBLIC_* vars here so they're validated at startup.
 */

interface EnvConfig {
  webhookUrl: string;
  apiUrl: string;
  neuroWealthApiBaseUrl: string;
  neuroWealthPortfolioPath: string;
  neuroWealthTransactionsPath: string;
}

function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Public variables (safe to expose to browser)
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Server-side variables
  const neuroWealthApiBaseUrl = process.env.NEUROWEALTH_API_BASE_URL;
  const neuroWealthPortfolioPath =
    process.env.NEUROWEALTH_PORTFOLIO_PATH || "/portfolio/overview";
  const neuroWealthTransactionsPath =
    process.env.NEUROWEALTH_TRANSACTIONS_PATH || "/transactions";

  // Validate required public variables
  if (!webhookUrl) {
    errors.push(
      "NEXT_PUBLIC_WEBHOOK_URL is required. Add it to .env.local or .env",
    );
  }

  if (!apiUrl) {
    errors.push(
      "NEXT_PUBLIC_API_URL is required. Add it to .env.local or .env",
    );
  }

  // Log warning if backend API is not configured (optional for dev)
  if (!neuroWealthApiBaseUrl && process.env.NODE_ENV === "development") {
    console.warn(
      "[env] NEUROWEALTH_API_BASE_URL not set. Using demo data for portfolio and transactions.",
    );
  }

  // Throw error if validation failed
  if (errors.length > 0) {
    const message = `Environment validation failed:\n${errors.join("\n")}`;
    throw new Error(message);
  }

  return {
    webhookUrl,
    apiUrl,
    neuroWealthApiBaseUrl: neuroWealthApiBaseUrl || "",
    neuroWealthPortfolioPath,
    neuroWealthTransactionsPath,
  };
}

// Validate on module load
let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

// For backward compatibility, export as const
export const env = getEnv();
