/**
 * User store — unified types with test-mode in-memory storage.
 * In tests (NODE_ENV==='test'), use an in-memory store including withdrawal fields.
 * In non-test environments, delegate to userRepository and map types.
 */
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';
import * as repo from './userRepository';

export type OnboardingStep =
  | 'awaiting_strategy'
  | 'awaiting_confirmation'
  | 'awaiting_deposit'
  | 'active'
  | 'withdrawal_amount'
  | 'withdrawal_confirm';

export type Strategy = 'conservative' | 'balanced' | 'growth';

export type NotificationType = "weekly_summary" | "rebalance" | "apy_alert";
export type TransactionType = "deposit" | "withdrawal" | "rebalance";

export interface NotificationHistory {
  id: string;
  userId: string;
  type: NotificationType;
  templateName: string;
  sentAt: Date;
  data: Record<string, any>;
}

export interface Transaction {
  id: string;
  phone: string;
  type: TransactionType;
  amount?: number;
  strategy?: Strategy;
  txHash?: string;
  metadata?: {
    fromAPY?: number;
    toAPY?: number;
    description?: string;
    walletAddress?: string;
  };
  createdAt: Date;
}

export interface User {
  id: string;
  phone: string;
  step: OnboardingStep;
  strategy: Strategy | null;
  walletAddress: string | null;
  encryptedPrivateKey: string | null;
  balance: number;
  pendingWithdrawal?: number;
  totalDeposited: number;
  depositedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const IS_TEST = process.env.NODE_ENV === 'test';

// ── In-memory test store ─────────────────────────────────────────────────────
const store = new Map<string, User>();
const notificationStore = new Map<string, NotificationHistory>();
const transactions = new Map<string, Transaction[]>();

async function mem_findUserByPhone(phone: string): Promise<User | null> {
  return store.get(phone) ?? null;
}
async function mem_createUser(phone: string): Promise<User> {
  const now = new Date();
  const user: User = {
    id: randomUUID(),
    phone,
    step: 'awaiting_strategy',
    strategy: null,
    walletAddress: null,
    encryptedPrivateKey: null,
    balance: 0,
    totalDeposited: 0,
    depositedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  store.set(phone, user);
  return user;
}
async function mem_setUserStrategy(phone: string, strategy: Strategy): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, strategy, step: 'awaiting_confirmation', updatedAt: new Date() });
}
async function mem_setUserWallet(phone: string, walletAddress: string, encryptedPrivateKey: string): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, walletAddress, encryptedPrivateKey, step: 'awaiting_deposit', updatedAt: new Date() });
}
async function mem_setUserDeposit(phone: string, totalDeposited: number, depositedAt: Date = new Date()): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, totalDeposited, depositedAt, step: totalDeposited > 0 ? 'active' : user.step, updatedAt: new Date() });
}
async function mem_setUserStep(phone: string, step: OnboardingStep): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, step, updatedAt: new Date() });
}
async function mem_incrementUserDeposit(userId: string, amount: number): Promise<void> {
  const user = Array.from(store.values()).find(u => u.id === userId); if (!user) throw new Error(`User not found: ${userId}`);
  const updated = { ...user, totalDeposited: user.totalDeposited + amount, depositedAt: user.depositedAt ?? new Date(), step: user.totalDeposited + amount > 0 ? 'active' : user.step, updatedAt: new Date() };
  store.set(updated.phone, updated);
}
async function mem_setPendingWithdrawal(phone: string, amount: number): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, pendingWithdrawal: amount, step: 'withdrawal_confirm', updatedAt: new Date() });
}
async function mem_executeWithdrawal(phone: string): Promise<void> {
  const user = store.get(phone); if (!user || !user.pendingWithdrawal) throw new Error(`No pending withdrawal for ${phone}`);
  store.set(phone, { ...user, balance: user.balance - user.pendingWithdrawal, pendingWithdrawal: undefined, step: 'active', updatedAt: new Date() });
}
async function mem_cancelWithdrawal(phone: string): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, pendingWithdrawal: undefined, step: 'active', updatedAt: new Date() });
}
async function mem_updateBalance(phone: string, balance: number): Promise<void> {
  const user = store.get(phone); if (!user) throw new Error(`User not found: ${phone}`);
  store.set(phone, { ...user, balance, updatedAt: new Date() });
}

// ── Repository adapters (non-test) ───────────────────────────────────────────
function mapRepoUser(u: repo.User): User {
  return {
    id: u.id,
    phone: u.phone,
    step: u.step as OnboardingStep,
    strategy: u.strategy as Strategy | null,
    walletAddress: u.walletAddress,
    encryptedPrivateKey: u.encryptedPrivateKey,
    balance: 0,
    totalDeposited: u.totalDeposited,
    depositedAt: u.depositedAt,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

async function repo_findUserByPhone(phone: string): Promise<User | null> {
  const u = await repo.findUserByPhone(phone);
  return u ? mapRepoUser(u) : null;
}
async function repo_createUser(phone: string): Promise<User> {
  const u = await repo.createUser(phone);
  return mapRepoUser(u);
}
const repo_setUserStrategy = repo.setUserStrategy;
const repo_setUserWallet = repo.setUserWallet;
const repo_setUserDeposit = repo.setUserDeposit;
const repo_setUserStep = repo.setUserStep;
const repo_incrementUserDeposit = repo.incrementUserDeposit;

async function notImplemented(): Promise<never> {
  throw new Error('This operation is not implemented in DB mode yet');
}

// ── Public API (conditional) ────────────────────────────────────────────────
export const findUserByPhone = IS_TEST ? mem_findUserByPhone : repo_findUserByPhone;
export const createUser = IS_TEST ? mem_createUser : repo_createUser;
export const setUserStrategy = IS_TEST ? mem_setUserStrategy : repo_setUserStrategy;
export const setUserWallet = IS_TEST ? mem_setUserWallet : repo_setUserWallet;
export const setUserDeposit = IS_TEST ? mem_setUserDeposit : repo_setUserDeposit;
export async function setUserStep(phone: string, step: OnboardingStep): Promise<void> {
  if (IS_TEST) {
    return mem_setUserStep(phone, step);
  }
  if (step === 'withdrawal_amount' || step === 'withdrawal_confirm') {
    throw new Error('Withdrawal steps are not supported in DB mode');
  }
  return repo_setUserStep(phone, step as any);
}
export const incrementUserDeposit = IS_TEST ? mem_incrementUserDeposit : repo_incrementUserDeposit;

export const setPendingWithdrawal = IS_TEST ? mem_setPendingWithdrawal : notImplemented;
export const executeWithdrawal = IS_TEST ? mem_executeWithdrawal : notImplemented;
export const cancelWithdrawal = IS_TEST ? mem_cancelWithdrawal : notImplemented;
export const updateBalance = IS_TEST ? mem_updateBalance : notImplemented;

// ── Notification & Transaction History ───────────────────────────────────────

export async function createNotificationHistory(
  userId: string,
  type: NotificationType,
  templateName: string,
  data: Record<string, any>
): Promise<NotificationHistory> {
  if (IS_TEST) {
    const notification: NotificationHistory = {
      id: randomUUID(),
      userId,
      type,
      templateName,
      sentAt: new Date(),
      data
    };
    notificationStore.set(notification.id, notification);
    return notification;
  }
  return notImplemented();
}

export async function getRecentNotification(
  userId: string,
  type: NotificationType,
  timeWindowMs: number
): Promise<NotificationHistory | null> {
  if (IS_TEST) {
    const now = Date.now();
    const notifications = Array.from(notificationStore.values())
      .filter(n => n.userId === userId && n.type === type)
      .filter(n => (now - n.sentAt.getTime()) < timeWindowMs)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

    return notifications[0] || null;
  }
  return notImplemented();
}

export async function getAllActiveUsers(): Promise<User[]> {
  if (IS_TEST) {
    return Array.from(store.values())
      .filter(user => user.step === 'active' && user.totalDeposited > 0);
  }
  return notImplemented();
}

export async function getNotificationHistory(
  userId: string,
  limit: number = 10
): Promise<NotificationHistory[]> {
  if (IS_TEST) {
    return Array.from(notificationStore.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime() || b.id.localeCompare(a.id))
      .slice(0, limit);
  }
  return notImplemented();
}

export async function addTransaction(tx: Omit<Transaction, "id" | "createdAt">): Promise<void> {
  if (IS_TEST) {
    const txId = randomUUID();
    const transaction: Transaction = {
      ...tx,
      id: txId,
      createdAt: new Date(),
    };
    
    const userTxs = transactions.get(tx.phone) || [];
    userTxs.unshift(transaction);
    transactions.set(tx.phone, userTxs);
    return;
  }
  // TODO: Implement in repository
  logger.warn('addTransaction not implemented in DB mode');
}

export async function getTransactionHistory(phone: string, limit: number = 5): Promise<Transaction[]> {
  if (IS_TEST) {
    const userTxs = transactions.get(phone) || [];
    return userTxs.slice(0, limit);
  }
  return [];
}

// ── Test helpers ─────────────────────────────────────────────────────────────
export const _test = {
  clear: () => {
    if (IS_TEST) {
      store.clear();
      notificationStore.clear();
      transactions.clear();
    } else {
      console.warn('_test.clear() is not supported with PostgreSQL');
    }
  },
  all: () => {
    if (IS_TEST) {
      return Array.from(store.values());
    } else {
      console.warn('_test.all() is not supported with PostgreSQL');
      return [];
    }
  },
  seed: (user: User) => {
    if (IS_TEST) {
      store.set(user.phone, user);
    } else {
      console.warn('_test.seed() is not supported with PostgreSQL');
    }
  },
};
