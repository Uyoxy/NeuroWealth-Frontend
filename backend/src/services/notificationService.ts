import * as cron from 'node-cron';
import { 
  findUserByPhone, 
  createNotificationHistory, 
  getRecentNotification, 
  getAllActiveUsers,
  getNotificationHistory,
  NotificationHistory as DbNotificationHistory,
  NotificationType as DbNotificationType
} from '../db/userStore';
import { logger } from '../utils/logger';
import { eventBus, EVENTS } from './eventBus';
import { getVaultShareValue } from '../utils/stellar';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = 'weekly_summary' | 'rebalance' | 'apy_alert';

export interface NotificationTemplate {
  type: NotificationType;
  templateName: string;
  content: string;
}

export interface WeeklySummaryData {
  weekStart: Date;
  weekEnd: Date;
  yieldEarned: number;
  portfolioValue: number;
  weeklyApy: number;
}

export interface RebalanceData {
  fromStrategy: string;
  toStrategy: string;
  oldApy: number;
  newApy: number;
}

export interface ApYAlertData {
  currentApy: number;
  originalApy: number;
  dropPercentage: number;
  recommendedStrategy: string;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

// Using database functions instead of in-memory storage

// ─── Template Definitions ───────────────────────────────────────────────────────

const TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  weekly_summary: {
    type: 'weekly_summary',
    templateName: 'weekly_yield_summary',
    content: `📈 Your Weekly NeuroWealth Update

 Week of {{weekRange}}
 ━━━━━━━━━━━━━━━━━━━━
 Yield Earned: +{{yieldEarned}} USDC
 Portfolio: {{portfolioValue}} USDC
 Weekly APY: {{weeklyApy}}%
 
 Your money worked while you slept. 💪
 Reply BALANCE for full details.`
  },
  rebalance: {
    type: 'rebalance',
    templateName: 'auto_rebalanced',
    content: `🔄 Auto-Rebalanced

 Found better yield! Moved your funds:
 {{fromStrategy}} → {{toStrategy}}
 
 APY improved: {{oldApy}}% → {{newApy}}% 🚀
 No action needed.`
  },
  apy_alert: {
    type: 'apy_alert',
    templateName: 'yield_drop_alert',
    content: `⚠️ Yield Alert

 Your current APY has dropped to {{currentApy}}%
 (was {{originalApy}}% when you joined)
 
 Consider switching to {{recommendedStrategy}} strategy
 for more stable returns.
 
 Reply STRATEGY to switch.`
  }
};

// ─── Notification Service ───────────────────────────────────────────────────────

class NotificationService {
  private whatsappService: any;

  constructor() {
    this.setupEventListeners();
    this.setupCronJobs();
  }

  private setupEventListeners(): void {
    // Listen for rebalance events from AI agent
    eventBus.on(EVENTS.AGENT_REBALANCED, (data: { userId: string; rebalanceData: RebalanceData }) => {
      this.handleRebalanceEvent(data.userId, data.rebalanceData);
    });

    // Listen for APY changes
    eventBus.on(EVENTS.PORTFOLIO_APY_CHANGED, (data: { userId: string; currentApy: number; originalApy: number }) => {
      this.handleApyChangeEvent(data.userId, data.currentApy, data.originalApy);
    });
  }

  private setupCronJobs(): void {
    // Don't schedule cron jobs in test environment
    if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined) {
      logger.info('Skipping cron job setup in test environment');
      return;
    }

    // Weekly summary - Every Monday at 9:00 AM
    cron.schedule('0 9 * * 1', () => {
      logger.info('Starting weekly summary notifications');
      this.sendWeeklySummaries();
    }, {
      timezone: 'UTC' // Will be adjusted per user timezone
    });

    // APY monitoring - Every hour
    cron.schedule('0 * * * *', () => {
      logger.info('Starting APY monitoring');
      this.monitorApyChanges();
    });
  }

  /**
   * Send a notification to a user
   */
  async send(userId: string, template: NotificationType, data: Record<string, any>): Promise<boolean> {
    try {
      // Check if we should send this notification (24-hour window, duplicates, etc.)
      if (!await this.shouldSendNotification(userId, template, data)) {
        logger.info({ userId, template }, 'Notification filtered out');
        return false;
      }

      const templateData = TEMPLATES[template];
      const message = this.renderTemplate(templateData.content, data);

      // Send via WhatsApp service
      const success = await this.sendWhatsAppMessage(userId, message, templateData.templateName);

      if (success) {
        // Store in history
        await this.storeNotification(userId, template, templateData.templateName, data);
        logger.info({ userId, template }, 'Notification sent successfully');
      }

      return success;
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : String(error), userId, template }, 'Failed to send notification');
      return false;
    }
  }

  /**
   * Send weekly summaries to all active users
   */
  private async sendWeeklySummaries(): Promise<void> {
    const allUsers = await getAllActiveUsers();

    for (const user of allUsers) {
      try {
        const summaryData = await this.generateWeeklySummaryData(user);
        if (summaryData) {
          await this.send(user.phone, 'weekly_summary', summaryData);
        }
      } catch (error) {
        logger.error({ error: error instanceof Error ? error.message : String(error), userId: user.phone }, 'Failed to send weekly summary');
      }
    }
  }

  /**
   * Monitor APY changes and send alerts if needed
   */
  private async monitorApyChanges(): Promise<void> {
    const allUsers = await getAllActiveUsers();

    for (const user of allUsers) {
      try {
        const currentApy = await this.getCurrentApy(user);
        const originalApy = await this.getOriginalApy(user);
        
        if (currentApy && originalApy) {
          const dropPercentage = ((originalApy - currentApy) / originalApy) * 100;
          
          if (dropPercentage > 2) { // More than 2% drop
            const alertData: ApYAlertData = {
              currentApy,
              originalApy,
              dropPercentage,
              recommendedStrategy: this.getRecommendedStrategy(currentApy)
            };
            
            await this.send(user.phone, 'apy_alert', alertData);
          }
        }
      } catch (error) {
        logger.error({ error: error instanceof Error ? error.message : String(error), userId: user.phone }, 'Failed to monitor APY');
      }
    }
  }

  /**
   * Handle rebalance events from AI agent
   */
  private async handleRebalanceEvent(userId: string, rebalanceData: RebalanceData): Promise<void> {
    await this.send(userId, 'rebalance', rebalanceData);
  }

  /**
   * Handle APY change events
   */
  private async handleApyChangeEvent(userId: string, currentApy: number, originalApy: number): Promise<void> {
    const dropPercentage = ((originalApy - currentApy) / originalApy) * 100;
    
    if (dropPercentage > 2) {
      const alertData: ApYAlertData = {
        currentApy,
        originalApy,
        dropPercentage,
        recommendedStrategy: this.getRecommendedStrategy(currentApy)
      };
      
      await this.send(userId, 'apy_alert', alertData);
    }
  }

  /**
   * Check if notification should be sent (24-hour window, duplicates, etc.)
   */
  private async shouldSendNotification(userId: string, template: NotificationType, data: Record<string, any>): Promise<boolean> {
    // Check 24-hour messaging window compliance
    if (!this.isWithin24HourWindow(userId)) {
      logger.warn({ userId }, 'Outside 24-hour messaging window');
      return false;
    }

    // Check for duplicates in last 24 hours
    const recentNotification = await this.getRecentNotification(userId, template, 24 * 60 * 60 * 1000);
    if (recentNotification) {
      logger.info({ userId, template }, 'Duplicate notification filtered');
      return false;
    }

    // APY alerts: max 1 per 24 hours per user
    if (template === 'apy_alert') {
      const lastApyAlert = await this.getRecentNotification(userId, 'apy_alert', 24 * 60 * 60 * 1000);
      if (lastApyAlert) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if we're within the 24-hour messaging window
   */
  private isWithin24HourWindow(userId: string): boolean {
    // In a real implementation, this would check the last user interaction time
    // For now, we'll assume we can send proactive messages using templates
    return true;
  }

  /**
   * Get recent notification for duplicate checking
   */
  private async getRecentNotification(userId: string, template: NotificationType, timeWindowMs: number): Promise<DbNotificationHistory | null> {
    return await getRecentNotification(userId, template as DbNotificationType, timeWindowMs);
  }

  /**
   * Store notification in history
   */
  private async storeNotification(userId: string, type: NotificationType, templateName: string, data: Record<string, any>): Promise<void> {
    await createNotificationHistory(userId, type as DbNotificationType, templateName, data);
  }

  /**
   * Render template with data
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template;
    
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return rendered;
  }

  /**
   * Send WhatsApp message
   */
  private async sendWhatsAppMessage(userId: string, message: string, templateName: string): Promise<boolean> {
    // This would integrate with the actual WhatsApp service
    // For now, we'll simulate success
    logger.info({ userId, templateName, message: message.substring(0, 100) + '...' }, 'Sending WhatsApp message');
    return true;
  }

  /**
   * Generate weekly summary data for a user
   */
  private async generateWeeklySummaryData(user: any): Promise<WeeklySummaryData | null> {
    try {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      
      const deposited = Number(user.totalDeposited || 0);
      if (deposited <= 0) return null;

      const currentValue = await getVaultShareValue(user.walletAddress, deposited * 1.02);
      const yieldEarned = currentValue - deposited;
      const weeklyApy = (yieldEarned / deposited) * 52 * 100; // Annualized weekly yield

      return {
        weekStart,
        weekEnd: now,
        yieldEarned: Math.round(yieldEarned * 100) / 100,
        portfolioValue: Math.round(currentValue * 100) / 100,
        weeklyApy: Math.round(weeklyApy * 10) / 10
      };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : String(error), userId: user.phone }, 'Failed to generate weekly summary');
      return null;
    }
  }

  /**
   * Get current APY for user
   */
  private async getCurrentApy(user: any): Promise<number | null> {
    // This would calculate the actual current APY based on portfolio performance
    // For now, we'll return the strategy APY
    const strategyApys = { conservative: 4.8, balanced: 8.2, growth: 12.6 };
    return strategyApys[user.strategy as keyof typeof strategyApys] || null;
  }

  /**
   * Get original APY when user joined
   */
  private async getOriginalApy(user: any): Promise<number | null> {
    // This would be stored when user first deposits
    // For now, we'll use the strategy APY as original
    return this.getCurrentApy(user);
  }

  /**
   * Get recommended strategy based on current APY
   */
  private getRecommendedStrategy(currentApy: number): string {
    if (currentApy < 5) return 'Conservative';
    if (currentApy < 8) return 'Balanced';
    return 'Growth';
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  /**
   * Get notification history for a user
   */
  async getNotificationHistory(userId: string, limit: number = 10): Promise<DbNotificationHistory[]> {
    return await getNotificationHistory(userId, limit);
  }

  /**
   * Clear notification history (for testing)
   */
  async clearHistory(): Promise<void> {
    // This would clear the database table
    // For now, we'll leave this as a placeholder
    logger.info('Notification history cleared');
  }
}

export const notificationService = new NotificationService();
export { TEMPLATES };
