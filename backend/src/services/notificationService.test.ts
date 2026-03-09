import { notificationService } from './notificationService';
import { createUser, setUserStrategy, setUserDeposit, _test } from '../db/userStore';
import { eventBus } from './eventBus';

describe('NotificationService', () => {
  beforeEach(() => {
    _test.clear();
  });

  describe('Weekly Summary', () => {
    it('should send weekly summary to active users', async () => {
      // Create a test user
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000, new Date('2024-01-01'));

      // Test weekly summary generation
      const result = await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: 'Jan 20–27',
        yieldEarned: '4.20',
        portfolioValue: '527.60',
        weeklyApy: '8.7'
      });

      expect(result).toBe(true);
    });
  });

  describe('Rebalance Notifications', () => {
    it('should trigger rebalance notification when event is emitted', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Emit rebalance event
      eventBus.emitAgentRebalanced(user.phone, {
        fromStrategy: 'Blend lending',
        toStrategy: 'DEX liquidity pool',
        oldApy: 7.2,
        newApy: 9.1
      });

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(1);
      expect(history[0].type).toBe('rebalance');
    });
  });

  describe('APY Alerts', () => {
    it('should send APY alert when drop exceeds threshold', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Test APY alert
      const result = await notificationService.send(user.phone, 'apy_alert', {
        currentApy: 5.1,
        originalApy: 8.2,
        dropPercentage: 37.8,
        recommendedStrategy: 'Conservative'
      });

      expect(result).toBe(true);
    });

    it('should not send duplicate APY alerts within 24 hours', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Send first APY alert
      const result1 = await notificationService.send(user.phone, 'apy_alert', {
        currentApy: 5.1,
        originalApy: 8.2,
        dropPercentage: 37.8,
        recommendedStrategy: 'Conservative'
      });

      expect(result1).toBe(true);

      // Try to send duplicate APY alert
      const result2 = await notificationService.send(user.phone, 'apy_alert', {
        currentApy: 5.0,
        originalApy: 8.2,
        dropPercentage: 39.0,
        recommendedStrategy: 'Conservative'
      });

      expect(result2).toBe(false); // Should be filtered out
    });
  });

  describe('Notification History', () => {
    it('should maintain notification history', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Send multiple notifications
      await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: 'Jan 20–27',
        yieldEarned: '4.20',
        portfolioValue: '527.60',
        weeklyApy: '8.7'
      });

      await notificationService.send(user.phone, 'rebalance', {
        fromStrategy: 'Blend lending',
        toStrategy: 'DEX liquidity pool',
        oldApy: 7.2,
        newApy: 9.1
      });

      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(2);
      expect(history[0].type).toBe('rebalance'); // Most recent first
      expect(history[1].type).toBe('weekly_summary');
    });
  });

  describe('Template Rendering', () => {
    it('should correctly render templates with data', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      const result = await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: 'Jan 20–27',
        yieldEarned: '4.20',
        portfolioValue: '527.60',
        weeklyApy: '8.7'
      });

      expect(result).toBe(true);
    });
  });
});
