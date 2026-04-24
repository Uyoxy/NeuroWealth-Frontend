/**
 * mock-auth.ts
 *
 * Simulates authentication for development/demo purposes.
 * Uses SESSION_STORAGE_KEY from auth-constants so the key is
 * never hardcoded in more than one place.
 */

import { SESSION_STORAGE_KEY } from "./auth-constants";
import {
  adaptMockAuthUser,
  type MockAuthUserRecord,
} from "./user";
import type { User } from "@/types";

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

const MOCK_USERS: Record<string, { password: string; user: MockAuthUserRecord }> = {
  "demo@neurowealth.app": {
    password: "demo123",
    user: {
      id: "usr_demo_001",
      email: "demo@neurowealth.app",
      name: "Demo User",
      avatar: undefined,
      walletAddress: "GDEMO...XLM",
      createdAt: new Date().toISOString(),
    },
  },
};

function generateToken(): string {
  return `mock_token_${Math.random().toString(36).slice(2)}`;
}

function isLegacyMockAuthUserRecord(value: unknown): value is MockAuthUserRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MockAuthUserRecord>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.name === "string"
  );
}

function normalizeSession(value: unknown): AuthSession | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<AuthSession> & {
    user?: User | MockAuthUserRecord;
  };

  if (typeof candidate.token !== "string" || typeof candidate.expiresAt !== "number") {
    return null;
  }

  if (!candidate.user) {
    return null;
  }

  const user = isLegacyMockAuthUserRecord(candidate.user)
    ? adaptMockAuthUser(candidate.user)
    : (candidate.user as User);

  if (!user.id || !user.displayName) {
    return null;
  }

  return {
    user,
    token: candidate.token,
    expiresAt: candidate.expiresAt,
  };
}

export const mockAuth = {
  /** Read the current session from localStorage (client-only). */
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session = normalizeSession(JSON.parse(raw));
      if (!session) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  /** Returns true when a valid, non-expired session exists. */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  async signIn(email: string, password: string): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 400)); // simulate network
    const record = MOCK_USERS[email.toLowerCase()];
    if (!record || record.password !== password) {
      throw new Error("Invalid email or password");
    }
    const session: AuthSession = {
      user: adaptMockAuthUser(record.user),
      token: generateToken(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },

  async signUp(
    email: string,
    name: string,
    password: string,
  ): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 400));
    if (MOCK_USERS[email.toLowerCase()]) {
      throw new Error("An account with this email already exists");
    }
    const user: MockAuthUserRecord = {
      id: `usr_${Math.random().toString(36).slice(2)}`,
      email: email.toLowerCase(),
      name,
      createdAt: new Date().toISOString(),
    };
    MOCK_USERS[email.toLowerCase()] = { password, user };
    const session: AuthSession = {
      user: adaptMockAuthUser(user),
      token: generateToken(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },

  signOut(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },
};
