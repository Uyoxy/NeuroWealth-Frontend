# NeuroWealth Notification System

This document describes the comprehensive WhatsApp notification system for NeuroWealth, which sends proactive messages to users about important events in their DeFi portfolio.

## Overview

The notification system automatically sends WhatsApp messages to users when:
- **Weekly Yield Summary**: Every Monday at 9 AM (user's timezone)
- **Rebalance Notifications**: When the AI agent finds better yield opportunities
- **APY Drop Alerts**: When portfolio APY drops more than 2% from when user joined

## Architecture

### Core Components

1. **NotificationService** (`notificationService.ts`)
   - Main orchestrator for all notifications
   - Handles template rendering and duplicate prevention
   - Manages 24-hour messaging window compliance
   - Stores notification history in database

2. **AIAgentService** (`aiAgent.ts`)
   - Monitors market conditions every 30 minutes
   - Identifies rebalance opportunities
   - Executes rebalances and triggers notifications

3. **MetaTemplateService** (`metaTemplates.ts`)
   - Manages WhatsApp message templates
   - Handles template registration with Meta Business
   - Provides template status monitoring

4. **EventBus** (`eventBus.ts`)
   - Decouples notification triggers from senders
   - Handles rebalance and APY change events

## Notification Types

### 1. Weekly Yield Summary

**When**: Every Monday at 9:00 AM (user's timezone)
**Template**: `weekly_yield_summary`

```
📈 Your Weekly NeuroWealth Update

 Week of Jan 20–27
 ━━━━━━━━━━━━━━━━━━━━
 Yield Earned: +4.20 USDC
 Portfolio: 527.60 USDC
 Weekly APY: 8.7%
 
 Your money worked while you slept. 💪
 Reply BALANCE for full details.
```

**Data Required**:
- `weekRange`: Date range (e.g., "Jan 20–27")
- `yieldEarned`: Yield earned in USDC
- `portfolioValue`: Current portfolio value in USDC
- `weeklyApy`: Weekly APY percentage

### 2. Rebalance Notification

**When**: AI agent finds and executes better yield opportunity
**Template**: `auto_rebalanced`

```
🔄 Auto-Rebalanced

 Found better yield! Moved your funds:
 Blend lending → DEX liquidity pool
 
 APY improved: 7.2% → 9.1% 🚀
 No action needed.
```

**Data Required**:
- `fromStrategy`: Previous strategy name
- `toStrategy`: New strategy name
- `oldApy`: Previous APY percentage
- `newApy`: New APY percentage

### 3. APY Drop Alert

**When**: Portfolio APY drops >2% from when user joined
**Template**: `yield_drop_alert`

```
⚠️ Yield Alert

 Your current APY has dropped to 5.1%
 (was 8.2% when you joined)
 
 Consider switching to Conservative strategy
 for more stable returns.
 
 Reply STRATEGY to switch.
```

**Data Required**:
- `currentApy`: Current APY percentage
- `originalApy`: Original APY when user joined
- `dropPercentage`: Percentage drop
- `recommendedStrategy`: Recommended strategy name

## Implementation Details

### Database Schema

```typescript
interface NotificationHistory {
  id: string;
  userId: string;
  type: 'weekly_summary' | 'rebalance' | 'apy_alert';
  templateName: string;
  sentAt: Date;
  data: Record<string, any>;
}
```

### Duplicate Prevention

The system prevents duplicate notifications by:
1. Checking recent notification history (24-hour window)
2. APY alerts limited to 1 per 24 hours per user
3. Template-based filtering for proactive messaging

### 24-Hour Messaging Window

Meta's WhatsApp Business API requires compliance with the 24-hour messaging window:
- **User-initiated**: Any message within 24 hours of last user interaction
- **Business-initiated**: Only template messages outside 24-hour window
- **Current implementation**: Uses approved templates for all proactive messages

## Cron Jobs

### Weekly Summary
```javascript
cron.schedule('0 9 * * 1', () => {
  // Runs every Monday at 9:00 AM UTC
  sendWeeklySummaries();
}, { timezone: 'UTC' });
```

### APY Monitoring
```javascript
cron.schedule('0 * * * *', () => {
  // Runs every hour
  monitorApyChanges();
});
```

### AI Agent Monitoring
```javascript
setInterval(() => {
  checkRebalanceOpportunities();
}, 30 * 60 * 1000); // Every 30 minutes
```

## API Usage

### Sending Notifications

```typescript
import { notificationService } from './services/notificationService';

// Send weekly summary
await notificationService.send(userId, 'weekly_summary', {
  weekRange: 'Jan 20–27',
  yieldEarned: '4.20',
  portfolioValue: '527.60',
  weeklyApy: '8.7'
});

// Send rebalance notification
await notificationService.send(userId, 'rebalance', {
  fromStrategy: 'Blend lending',
  toStrategy: 'DEX liquidity pool',
  oldApy: 7.2,
  newApy: 9.1
});

// Send APY alert
await notificationService.send(userId, 'apy_alert', {
  currentApy: 5.1,
  originalApy: 8.2,
  dropPercentage: 37.8,
  recommendedStrategy: 'Conservative'
});
```

### Getting Notification History

```typescript
const history = await notificationService.getNotificationHistory(userId, 10);
console.log(history); // Array of recent notifications
```

### AI Agent Manual Rebalance

```typescript
import { aiAgentService } from './services/aiAgent';

const wasRebalanced = await aiAgentService.checkUserRebalance(userId);
console.log('Rebalance executed:', wasRebalanced);
```

## Meta Template Setup

### Automatic Registration

```typescript
import { metaTemplateService } from './services/metaTemplates';

// Register all templates
await metaTemplateService.registerAllTemplates();

// Check template status
const status = await metaTemplateService.checkTemplateStatus();
console.log(status);
```

### Manual Setup Commands

The system generates curl commands for manual template registration:

```bash
curl -X POST \
  https://graph.facebook.com/v22.0/PHONE_NUMBER_ID/message_templates \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "weekly_yield_summary",
    "category": "UTILITY",
    "language": "en",
    "components": [...]
  }'
```

## Testing

### Unit Tests

```typescript
// Test notification service
import { notificationService } from './services/notificationService';

describe('NotificationService', () => {
  it('should send weekly summary', async () => {
    const result = await notificationService.send(userId, 'weekly_summary', data);
    expect(result).toBe(true);
  });
});
```

### Manual Testing

1. Create a test user with active portfolio
2. Trigger events manually:
   ```typescript
   eventBus.emitAgentRebalanced(userId, rebalanceData);
   eventBus.emitPortfolioApyChanged(userId, currentApy, originalApy);
   ```

## Configuration

### Environment Variables

```bash
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Notification settings
NOTIFICATION_DEBUG=true
WEEKLY_SUMMARY_TIMEZONE=UTC
```

## Monitoring

### Logs

The system logs all notification activities:
- Sent notifications
- Filtered duplicates
- Template registration status
- AI agent rebalance activities

### Metrics to Monitor

1. **Delivery Rate**: Percentage of successful message sends
2. **Duplicate Prevention**: Number of filtered duplicates
3. **Engagement**: User replies to notifications
4. **Template Approval**: Status of Meta template approval

## Troubleshooting

### Common Issues

1. **Template Not Approved**
   - Check Meta Business Manager
   - Verify template content compliance
   - Use `metaTemplateService.checkTemplateStatus()`

2. **Messages Not Sending**
   - Verify WhatsApp credentials
   - Check 24-hour messaging window
   - Review notification history

3. **Duplicate Notifications**
   - Check notification history
   - Verify time window logic
   - Review event bus emissions

### Debug Mode

Enable debug logging:
```typescript
logger.level = 'debug';
```

## Security Considerations

1. **Access Tokens**: Store securely in environment variables
2. **User Data**: Encrypt sensitive notification data
3. **Rate Limiting**: Respect Meta API rate limits
4. **Template Compliance**: Ensure all templates follow Meta guidelines

## Future Enhancements

1. **Personalization**: User-specific timing and content
2. **Multi-language**: Support for multiple languages
3. **Rich Media**: Image and video notifications
4. **Interactive Elements**: Quick reply buttons
5. **Analytics**: Detailed notification performance metrics

## Support

For issues related to:
- **WhatsApp API**: Meta Business Developer documentation
- **Notification Logic**: Review service implementation
- **AI Agent**: Check market data integration
- **Database**: Verify notification history storage
