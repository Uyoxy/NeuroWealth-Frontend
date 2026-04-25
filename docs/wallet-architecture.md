# Stellar Wallet Integration & Architecture

This document describes how NeuroWealth manages wallet connections, persistence, and the distinction between wallet-level "connection" and application-level "authentication".

## Metadata Dictionary (LocalStorage)

The `WalletProvider` persists minimal connection metadata to `localStorage` to enable auto-reconnection across page refreshes.

| Key | Value Type | Description |
|:---|:---|:---|
| `stellar_wallet_connected` | `"true" \| undefined` | Boolean flag indicating if a wallet was previously connected. |
| `stellar_wallet_id` | `string` | The ID of the wallet provider (e.g., `"freighter"`, `"albedo"`). Matches `@creit.tech/stellar-wallets-kit` IDs. |
| `stellar_wallet_address` | `string` | The public G-address of the connected account. |
| `stellar_wallet_name` | `string` | Human-readable name of the wallet (e.g., `"Freighter"`). |

> [!IMPORTANT]
> These keys ONLY track the UI connection state. They do not represent a secure session.

## Connection vs. Session Auth

It is critical to distinguish between the **Wallet Connection** and **Application Authentication**:

1.  **Wallet Connection (Frontend-only)**:
    - Facilitated by `WalletProvider`.
    - Allows the frontend to request transaction signatures via the user's browser extension.
    - Status is stored in the `localStorage` keys listed above.
    - **Security**: Low. LocalStorage can be read by any script on the origin. This only gives the app the user's *public* address.

2.  **Session Auth (Future / Backend-integrated)**:
    - To perform actions on the user's behalf or access private data, a proper Auth session (JWT or Cookie) is required.
    - This typically involves the user signing a "Challenge" (SEP-10 standard) to prove ownership of the private key.
    - NeuroWealth currently uses the wallet connection primarily for triggering on-chain transactions from the browser.

## WalletProvider Behavior

### Auto-Reconnect Logic
On mount, the `WalletProvider` checks for `stellar_wallet_connected === 'true'`. If found, it attempts to:
1.  Initialize the `stellar-wallets-kit` with the saved `stellar_wallet_id`.
2.  Silently request the address from the extension.
3.  If the address matches the saved `stellar_wallet_address`, the connection is restored.
4.  If any step fails (e.g., wallet locked, extension uninstalled), the localStorage is cleared.

### Transaction Signing
When `sendPayment` is called:
- It builds a transaction using `@stellar/stellar-sdk`.
- If a `secret` is provided (internal use), it signs with the Keypair.
- Otherwise, it invokes the `stellar-wallets-kit` modal/extension to request a user signature.
- Submits the resulting XDR to the configured Horizon endpoint.
