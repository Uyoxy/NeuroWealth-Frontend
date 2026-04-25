/**
 * Centralized storage key registry
 * All localStorage keys must be defined here to ensure consistency and prevent duplication.
 * Naming convention: "nw_" prefix for NeuroWealth keys, followed by feature name in snake_case
 */

export const STORAGE_KEYS = {
    // Cookie consent (Issue #131)
    COOKIE_CONSENT: "nw_cookie_consent",

    // Theme preferences
    THEME: "nw_theme",

    // User preferences
    PREFERENCES: "nw_preferences",

    // Notification settings
    NOTIFICATIONS: "nw_notifications",

    // Security settings
    SECURITY: "nw_security",

    // Profile data
    PROFILE: "nw_profile",

    // Onboarding state
    ONBOARDING_STATE: "nw_onboarding_state",

    // Sandbox mode data
    SANDBOX_SCENARIOS: "nw_sandbox_scenarios",

    // Wallet connection state (Stellar)
    WALLET_CONNECTED: "nw_wallet_connected",
    WALLET_PUBLIC_KEY: "nw_wallet_public_key",
    WALLET_NETWORK: "nw_wallet_network",
    WALLET_PROVIDER: "nw_wallet_provider",
} as const;

/**
 * Type-safe storage key getter
 * Usage: getStorageKey('COOKIE_CONSENT')
 */
export function getStorageKey(key: keyof typeof STORAGE_KEYS): string {
    return STORAGE_KEYS[key];
}
