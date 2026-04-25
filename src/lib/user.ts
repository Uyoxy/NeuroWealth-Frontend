import type { ApiResponse } from "@/lib/api-response";
import type { User } from "@/types";

export interface MockAuthUserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  walletAddress?: string;
  createdAt: string;
}

export interface ApiUserRecord {
  id: string;
  email?: string | null;
  name?: string | null;
  displayName?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  walletAddress?: string | null;
  address?: string | null;
  createdAt?: string | null;
}

export interface ApiUserPayload {
  user: ApiUserRecord;
}

export type UserApiResponse = ApiResponse<ApiUserPayload>;

const DEFAULT_USER_LABEL = "User";

function pickFirstValue(
  ...values: Array<string | null | undefined>
): string | undefined {
  return values.find(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
}

export function getUserInitials(displayName: string): string {
  const parts = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "??";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function truncateWalletAddress(walletAddress: string): string {
  if (walletAddress.includes("...") || walletAddress.length <= 12) {
    return walletAddress;
  }

  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
}

function resolveDisplayName(
  fallbackValues: Array<string | null | undefined>,
): string {
  return pickFirstValue(...fallbackValues) ?? DEFAULT_USER_LABEL;
}

export function adaptMockAuthUser(record: MockAuthUserRecord): User {
  const displayName = resolveDisplayName([
    record.name,
    record.email.split("@")[0],
    record.walletAddress,
    record.id,
  ]);

  return {
    id: record.id,
    displayName,
    email: record.email.toLowerCase(),
    walletAddress: record.walletAddress,
    avatarUrl: record.avatar,
    avatarInitials: getUserInitials(displayName),
    createdAt: record.createdAt,
  };
}

export function adaptApiUser(record: ApiUserRecord): User {
  const walletAddress = pickFirstValue(record.walletAddress, record.address);
  const displayName = resolveDisplayName([
    record.displayName,
    record.name,
    record.email ? record.email.split("@")[0] : undefined,
    walletAddress,
    record.id,
  ]);

  return {
    id: record.id,
    displayName,
    email: record.email ?? undefined,
    walletAddress,
    avatarUrl: pickFirstValue(record.avatarUrl, record.avatar),
    avatarInitials: getUserInitials(displayName),
    createdAt: record.createdAt ?? undefined,
  };
}

export function getUserAddressLabel(
  user: Pick<User, "walletAddress">,
): string | undefined {
  return user.walletAddress ? truncateWalletAddress(user.walletAddress) : undefined;
}
