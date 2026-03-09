import { eventBus } from './eventBus';
import { logger } from '../utils/logger';
import { findUserByPhone, getAllActiveUsers } from '../db/userStore';
import { RebalanceData } from './notificationService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StrategyPerformance {
  strategy: string;
  currentApy: number;
  risk: 'low' | 'medium' | 'high';
  liquidity: number; // Available liquidity in millions
}

export interface RebalanceOpportunity {
  userId: string;
  fromStrategy: string;
  toStrategy: string;
  expectedImprovement: number; // APY improvement percentage
  risk: 'low' | 'medium' | 'high';
}

// ─── AI Agent Service ───────────────────────────────────────────────────────────

class AIAgentService {
  private isRunning: boolean = false;
  private rebalanceInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
  }

  /**
   * Start the AI agent monitoring
   */
  startMonitoring(): void {
    // Don't start monitoring in test environment
    if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined) {
      logger.info('Skipping AI agent monitoring in test environment');
      return;
    }

    if (this.isRunning) {
      logger.warn('AI agent is already running');
      return;
    }

    this.isRunning = true;
    logger.info('AI agent started monitoring for rebalance opportunities');

    // Check for rebalance opportunities every 30 minutes
    this.rebalanceInterval = setInterval(() => {
      this.checkRebalanceOpportunities();
    }, 30 * 60 * 1000);

    // Initial check
    this.checkRebalanceOpportunities();
  }

  /**
   * Stop the AI agent monitoring
   */
  stopMonitoring(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.rebalanceInterval) {
      clearInterval(this.rebalanceInterval);
      this.rebalanceInterval = null;
    }

    logger.info('AI agent stopped monitoring');
  }

  /**
   * Check for rebalance opportunities across all active users
   */
  private async checkRebalanceOpportunities(): Promise<void> {
    try {
      logger.info('Checking for rebalance opportunities');
      
      const activeUsers = await getAllActiveUsers();
      const opportunities = await this.analyzeRebalanceOpportunities(activeUsers);

      for (const opportunity of opportunities) {
        await this.executeRebalance(opportunity);
      }

      if (opportunities.length > 0) {
        logger.info({ count: opportunities.length }, 'Rebalance opportunities found and executed');
      }
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Failed to check rebalance opportunities');
    }
  }

  /**
   * Analyze rebalance opportunities for users
   */
  private async analyzeRebalanceOpportunities(users: any[]): Promise<RebalanceOpportunity[]> {
    const opportunities: RebalanceOpportunity[] = [];
    
    // Get current market conditions (simulated)
    const marketConditions = await this.getMarketConditions();

    for (const user of users) {
      const opportunity = await this.evaluateUserStrategy(user, marketConditions);
      if (opportunity) {
        opportunities.push(opportunity);
      }
    }

    return opportunities;
  }

  /**
   * Evaluate if a user's strategy should be rebalanced
   */
  private async evaluateUserStrategy(user: any, marketConditions: StrategyPerformance[]): Promise<RebalanceOpportunity | null> {
    const currentStrategy = marketConditions.find(s => s.strategy.toLowerCase() === user.strategy);
    if (!currentStrategy) {
      return null;
    }

    // Find better strategies
    const betterStrategies = marketConditions.filter(s => 
      s.strategy !== currentStrategy.strategy &&
      s.currentApy > currentStrategy.currentApy + 0.5 // Minimum 0.5% improvement
    );

    if (betterStrategies.length === 0) {
      return null;
    }

    // Select the best strategy considering risk and liquidity
    const bestStrategy = betterStrategies.reduce((best, current) => {
      const bestScore = this.calculateStrategyScore(best, user.strategy);
      const currentScore = this.calculateStrategyScore(current, user.strategy);
      return currentScore > bestScore ? current : best;
    });

    const improvement = bestStrategy.currentApy - currentStrategy.currentApy;

    return {
      userId: user.phone,
      fromStrategy: this.formatStrategyName(currentStrategy.strategy),
      toStrategy: this.formatStrategyName(bestStrategy.strategy),
      expectedImprovement: improvement,
      risk: bestStrategy.risk
    };
  }

  /**
   * Calculate strategy score based on APY improvement, risk, and liquidity
   */
  private calculateStrategyScore(strategy: StrategyPerformance, userStrategy: string): number {
    let score = strategy.currentApy * 10; // Base score from APY

    // Risk adjustment
    if (strategy.risk === 'low') score += 2;
    else if (strategy.risk === 'medium') score += 1;
    else score -= 1; // High risk penalty

    // Liquidity bonus
    if (strategy.liquidity > 10) score += 1;
    else if (strategy.liquidity < 1) score -= 2; // Low liquidity penalty

    // User risk preference adjustment
    if (userStrategy === 'conservative' && strategy.risk !== 'low') score -= 3;
    if (userStrategy === 'growth' && strategy.risk === 'high') score += 2;

    return score;
  }

  /**
   * Execute a rebalance for a user
   */
  private async executeRebalance(opportunity: RebalanceOpportunity): Promise<void> {
    try {
      logger.info({ 
        userId: opportunity.userId, 
        from: opportunity.fromStrategy, 
        to: opportunity.toStrategy,
        improvement: opportunity.expectedImprovement 
      }, 'Executing rebalance');

      // Simulate rebalance execution (in real implementation, this would interact with DeFi protocols)
      await this.simulateRebalanceExecution(opportunity);

      // Create rebalance data for notification
      const rebalanceData: RebalanceData = {
        fromStrategy: opportunity.fromStrategy,
        toStrategy: opportunity.toStrategy,
        oldApy: parseFloat((this.getStrategyApy(opportunity.fromStrategy) - opportunity.expectedImprovement).toFixed(1)),
        newApy: parseFloat(this.getStrategyApy(opportunity.toStrategy).toFixed(1))
      };

      // Emit rebalance event for notification service
      eventBus.emitAgentRebalanced(opportunity.userId, rebalanceData);

      logger.info({ userId: opportunity.userId }, 'Rebalance completed and notification sent');
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error), 
        userId: opportunity.userId 
      }, 'Failed to execute rebalance');
    }
  }

  /**
   * Simulate rebalance execution (placeholder for actual DeFi interactions)
   */
  private async simulateRebalanceExecution(opportunity: RebalanceOpportunity): Promise<void> {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // In a real implementation, this would:
    // 1. Withdraw funds from current strategy
    // 2. Swap to new strategy
    // 3. Update user's strategy in database
    // 4. Handle gas fees and slippage
    // 5. Record transaction details
    
    logger.debug({ 
      userId: opportunity.userId,
      executionTime: 'simulated'
    }, 'Rebalance execution simulated');
  }

  /**
   * Get current market conditions (simulated)
   */
  private async getMarketConditions(): Promise<StrategyPerformance[]> {
    // In a real implementation, this would fetch data from:
    // - DeFi protocols (Aave, Compound, Curve, etc.)
    // - DEX analytics (Uniswap, SushiSwap liquidity pools)
    // - Yield aggregators (Yearn, Beefy)
    // - Market data providers
    
    return [
      {
        strategy: 'conservative',
        currentApy: 4.8 + Math.random() * 0.4 - 0.2, // 4.6% - 5.2%
        risk: 'low',
        liquidity: 50 + Math.random() * 20 // 50-70M
      },
      {
        strategy: 'balanced',
        currentApy: 8.2 + Math.random() * 0.8 - 0.4, // 7.8% - 8.6%
        risk: 'medium',
        liquidity: 30 + Math.random() * 15 // 30-45M
      },
      {
        strategy: 'growth',
        currentApy: 12.6 + Math.random() * 1.2 - 0.6, // 12.0% - 13.2%
        risk: 'high',
        liquidity: 15 + Math.random() * 10 // 15-25M
      }
    ];
  }

  /**
   * Format strategy name for display
   */
  private formatStrategyName(strategy: string): string {
    const strategyMap: Record<string, string> = {
      'conservative': 'Conservative lending pool',
      'balanced': 'Balanced liquidity pool',
      'growth': 'Growth DEX strategy'
    };
    return strategyMap[strategy.toLowerCase()] || strategy;
  }

  /**
   * Get strategy APY (simplified)
   */
  private getStrategyApy(strategyName: string): number {
    const apyMap: Record<string, number> = {
      'conservative lending pool': 4.8,
      'balanced liquidity pool': 8.2,
      'growth dex strategy': 12.6,
      'blend lending': 7.2,
      'dex liquidity pool': 9.1
    };
    return apyMap[strategyName.toLowerCase()] || 5.0;
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  /**
   * Manually trigger a rebalance check for a specific user
   */
  async checkUserRebalance(userId: string): Promise<boolean> {
    try {
      const user = await findUserByPhone(userId);
      if (!user || user.step !== 'active') {
        return false;
      }

      const marketConditions = await this.getMarketConditions();
      const opportunity = await this.evaluateUserStrategy(user, marketConditions);

      if (opportunity) {
        await this.executeRebalance(opportunity);
        return true;
      }

      return false;
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : String(error), userId }, 'Failed to check user rebalance');
      return false;
    }
  }

  /**
   * Get current market conditions for display
   */
  async getMarketConditionsForDisplay(): Promise<StrategyPerformance[]> {
    return await this.getMarketConditions();
  }

  /**
   * Check if AI agent is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

export const aiAgentService = new AIAgentService();
