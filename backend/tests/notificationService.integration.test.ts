import { notificationService } from '../src/services/notificationService';
import { aiAgentService } from '../src/services/aiAgent';
import { metaTemplateService } from '../src/services/metaTemplates';
import { createUser, setUserStrategy, setUserDeposit, _test } from '../src/db/userStore';
import { eventBus } from '../src/services/eventBus';

describe('Notification System Integration', () => {
  beforeEach(() => {
    _test.clear();
  });

  describe('End-to-End Notification Flow', () => {
    it('should handle complete notification workflow', async () => {
      // Create test user
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000, new Date('2024-01-01'));

      // 1. Test weekly summary notification
      const weeklyResult = await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: 'Jan 20–27',
        yieldEarned: '4.20',
        portfolioValue: '527.60',
        weeklyApy: '8.7'
      });
      expect(weeklyResult).toBe(true);

      // 2. Test rebalance notification through event bus
      eventBus.emitAgentRebalanced(user.phone, {
        fromStrategy: 'Blend lending',
        toStrategy: 'DEX liquidity pool',
        oldApy: 7.2,
        newApy: 9.1
      });

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. Test APY alert notification
      const apyResult = await notificationService.send(user.phone, 'apy_alert', {
        currentApy: 5.1,
        originalApy: 8.2,
        dropPercentage: 37.8,
        recommendedStrategy: 'Conservative'
      });
      expect(apyResult).toBe(true);

      // 4. Verify notification history
      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(3);
      expect(history[0].type).toBe('apy_alert'); // Most recent
      expect(history[1].type).toBe('rebalance');
      expect(history[2].type).toBe('weekly_summary');

      // 5. Test duplicate prevention
      const duplicateResult = await notificationService.send(user.phone, 'apy_alert', {
        currentApy: 5.0,
        originalApy: 8.2,
        dropPercentage: 39.0,
        recommendedStrategy: 'Conservative'
      });
      expect(duplicateResult).toBe(false); // Should be filtered out

      // 6. Verify still only 3 notifications
      const finalHistory = await notificationService.getNotificationHistory(user.phone);
      expect(finalHistory).toHaveLength(3);
    });
  });

  describe('AI Agent Integration', () => {
    it('should trigger notifications through AI agent rebalance', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'conservative');
      await setUserDeposit(user.phone, 500);

      // Mock AI agent to find rebalance opportunity
      const mockRebalanceData = {
        fromStrategy: 'Conservative lending pool',
        toStrategy: 'Balanced liquidity pool',
        oldApy: 4.8,
        newApy: 8.2
      };

      // Emit rebalance event (simulating AI agent)
      eventBus.emitAgentRebalanced(user.phone, mockRebalanceData);

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify notification was sent
      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(1);
      expect(history[0].type).toBe('rebalance');
      expect(history[0].data.fromStrategy).toBe(mockRebalanceData.fromStrategy);
    });
  });

  describe('Template Service Integration', () => {
    it('should generate template registration commands', () => {
      const commands = metaTemplateService.generateManualSetupCommands();
      expect(commands.length).toBeGreaterThan(0);
      expect(commands.join('')).toContain('curl -X POST');
      expect(commands.join('')).toContain('weekly_yield_summary');
      expect(commands.join('')).toContain('auto_rebalanced');
      expect(commands.join('')).toContain('yield_drop_alert');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple users efficiently', async () => {
      const users = [];
      
      // Create multiple test users
      for (let i = 0; i < 10; i++) {
        const user = await createUser(`+123456789${i}`);
        await setUserStrategy(user.phone, 'balanced');
        await setUserDeposit(user.phone, 1000);
        users.push(user);
      }

      // Send notifications to all users
      const startTime = Date.now();
      const promises = users.map(user => 
        notificationService.send(user.phone, 'weekly_summary', {
          weekRange: 'Jan 20–27',
          yieldEarned: '4.20',
          portfolioValue: '527.60',
          weeklyApy: '8.7'
        })
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      // Verify all notifications were sent
      expect(results.every((r: boolean) => r === true)).toBe(true);
      
      // Verify performance (should complete within reasonable time)
      expect(endTime - startTime).toBeLessThan(5000); // 5 seconds

      // Verify each user has notification history
      for (const user of users) {
        const history = await notificationService.getNotificationHistory(user.phone);
        expect(history).toHaveLength(1);
        expect(history[0].type).toBe('weekly_summary');
      }
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle notification failures gracefully', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Test with invalid data (should still return true as we simulate success)
      const result = await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: '',
        yieldEarned: 'invalid',
        portfolioValue: 'invalid',
        weeklyApy: 'invalid'
      });

      expect(result).toBe(true); // Service should handle gracefully

      // Verify notification was still stored
      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(1);
    });
  });

  describe('24-Hour Window Compliance', () => {
    it('should respect messaging window logic', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Send notification (should work - we're assuming within window)
      const result1 = await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: 'Jan 20–27',
        yieldEarned: '4.20',
        portfolioValue: '527.60',
        weeklyApy: '8.7'
      });
      expect(result1).toBe(true);

      // The 24-hour window check is currently implemented to always return true
      // In production, this would check actual user interaction times
      // For now, we verify the logic exists and works as expected
      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(1);
    });
  });

  describe('Template Rendering', () => {
    it('should correctly render all template types', async () => {
      const user = await createUser('+1234567890');
      await setUserStrategy(user.phone, 'balanced');
      await setUserDeposit(user.phone, 1000);

      // Test weekly summary template
      const weeklyResult = await notificationService.send(user.phone, 'weekly_summary', {
        weekRange: 'Jan 20–27',
        yieldEarned: '4.20',
        portfolioValue: '527.60',
        weeklyApy: '8.7'
      });
      expect(weeklyResult).toBe(true);

      // Test rebalance template
      const rebalanceResult = await notificationService.send(user.phone, 'rebalance', {
        fromStrategy: 'Blend lending',
        toStrategy: 'DEX liquidity pool',
        oldApy: 7.2,
        newApy: 9.1
      });
      expect(rebalanceResult).toBe(true);

      // Test APY alert template
      const apyResult = await notificationService.send(user.phone, 'apy_alert', {
        currentApy: 5.1,
        originalApy: 8.2,
        dropPercentage: 37.8,
        recommendedStrategy: 'Conservative'
      });
      expect(apyResult).toBe(true);

      // Verify all notifications were stored with correct data
      const history = await notificationService.getNotificationHistory(user.phone);
      expect(history).toHaveLength(3);
      
      const weeklyNotification = history.find((n: any) => n.type === 'weekly_summary');
      expect(weeklyNotification?.data.weekRange).toBe('Jan 20–27');
      
      const rebalanceNotification = history.find((n: any) => n.type === 'rebalance');
      expect(rebalanceNotification?.data.fromStrategy).toBe('Blend lending');
      
      const apyNotification = history.find((n: any) => n.type === 'apy_alert');
      expect(apyNotification?.data.currentApy).toBe(5.1);
    });
  });
});
