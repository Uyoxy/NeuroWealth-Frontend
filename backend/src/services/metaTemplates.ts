import { logger } from '../utils/logger';

// ─── Meta Message Templates ──────────────────────────────────────────────────────

export interface MetaTemplate {
  name: string;
  category: 'MARKETING' | 'UTILITY';
  language: string;
  components: MetaTemplateComponent[];
}

export interface MetaTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER';
  format?: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
}

// ─── Template Definitions ───────────────────────────────────────────────────────

export const META_TEMPLATES: MetaTemplate[] = [
  {
    name: 'weekly_yield_summary',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: '📈 Your Weekly NeuroWealth Update'
      },
      {
        type: 'BODY',
        text: `Week of {{1}}
━━━━━━━━━━━━━━━━━━━━━
Yield Earned: +{{2}} USDC
Portfolio: {{3}} USDC
Weekly APY: {{4}}%

Your money worked while you slept. 💪
Reply BALANCE for full details.`,
        example: {
          body_text: [
            ['Jan 20–27', '4.20', '527.60', '8.7']
          ]
        }
      },
      {
        type: 'FOOTER',
        text: 'NeuroWealth Automated Update'
      }
    ]
  },
  {
    name: 'auto_rebalanced',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: '🔄 Auto-Rebalanced'
      },
      {
        type: 'BODY',
        text: `Found better yield! Moved your funds:
{{1}} → {{2}}

APY improved: {{3}}% → {{4}}% 🚀
No action needed.`,
        example: {
          body_text: [
            ['Blend lending', 'DEX liquidity pool', '7.2', '9.1']
          ]
        }
      },
      {
        type: 'FOOTER',
        text: 'NeuroWealth AI Agent'
      }
    ]
  },
  {
    name: 'yield_drop_alert',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: '⚠️ Yield Alert'
      },
      {
        type: 'BODY',
        text: `Your current APY has dropped to {{1}}%
(was {{2}}% when you joined)

Consider switching to {{3}} strategy
for more stable returns.

Reply STRATEGY to switch.`,
        example: {
          body_text: [
            ['5.1', '8.2', 'Conservative']
          ]
        }
      },
      {
        type: 'FOOTER',
        text: 'NeuroWealth Risk Management'
      }
    ]
  }
];

// ─── Template Registration Service ───────────────────────────────────────────────

class MetaTemplateService {
  private accessToken: string;
  private phoneNumberId: string;
  private baseUrl = 'https://graph.facebook.com/v22.0';

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

    if (!this.accessToken || !this.phoneNumberId) {
      logger.warn('Meta credentials not found - template registration disabled');
    }
  }

  /**
   * Register all templates with Meta Business
   */
  async registerAllTemplates(): Promise<void> {
    if (!this.accessToken) {
      logger.error('Cannot register templates: WhatsApp access token not configured');
      return;
    }

    logger.info('Starting Meta template registration');

    for (const template of META_TEMPLATES) {
      try {
        await this.registerTemplate(template);
        logger.info({ templateName: template.name }, 'Template registered successfully');
      } catch (error) {
        logger.error({ 
          error: error instanceof Error ? error.message : String(error), 
          templateName: template.name 
        }, 'Failed to register template');
      }
    }

    logger.info('Meta template registration completed');
  }

  /**
   * Register a single template with Meta
   */
  private async registerTemplate(template: MetaTemplate): Promise<void> {
    const url = `${this.baseUrl}/${this.phoneNumberId}/message_templates`;

    const payload = {
      name: template.name,
      category: template.category,
      language: template.language,
      components: template.components
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Meta API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json() as any;
    logger.debug({ templateName: template.name, result }, 'Template registration response');
  }

  /**
   * Get all registered templates from Meta
   */
  async getRegisteredTemplates(): Promise<any[]> {
    if (!this.accessToken) {
      logger.error('Cannot fetch templates: WhatsApp access token not configured');
      return [];
    }

    const url = `${this.baseUrl}/${this.phoneNumberId}/message_templates`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Meta API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json() as any;
    return result.data || [];
  }

  /**
   * Delete a template from Meta
   */
  async deleteTemplate(templateName: string): Promise<boolean> {
    if (!this.accessToken) {
      logger.error('Cannot delete template: WhatsApp access token not configured');
      return false;
    }

    const url = `${this.baseUrl}/${this.phoneNumberId}/message_templates`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: templateName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error({ 
        error: `Meta API error: ${response.status} - ${JSON.stringify(errorData)}`,
        templateName 
      }, 'Failed to delete template');
      return false;
    }

    logger.info({ templateName }, 'Template deleted successfully');
    return true;
  }

  /**
   * Check if templates are ready for use
   */
  async checkTemplateStatus(): Promise<Record<string, 'approved' | 'pending' | 'rejected' | 'not_found'>> {
    const status: Record<string, 'approved' | 'pending' | 'rejected' | 'not_found'> = {};
    
    try {
      const registeredTemplates = await this.getRegisteredTemplates();
      
      for (const template of META_TEMPLATES) {
        const found = registeredTemplates.find((t: any) => t.name === template.name);
        if (found) {
          status[template.name] = found.status || 'pending';
        } else {
          status[template.name] = 'not_found';
        }
      }
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Failed to check template status');
      
      // Default to not_found if we can't check
      for (const template of META_TEMPLATES) {
        status[template.name] = 'not_found';
      }
    }

    return status;
  }

  /**
   * Generate template registration commands for manual setup
   */
  generateManualSetupCommands(): string[] {
    const commands: string[] = [];
    
    for (const template of META_TEMPLATES) {
      const componentsJson = JSON.stringify(template.components, null, 2);
      commands.push(`# Register ${template.name}`);
      commands.push(`curl -X POST \\
  https://graph.facebook.com/v22.0/${this.phoneNumberId}/message_templates \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "${template.name}",
    "category": "${template.category}",
    "language": "${template.language}",
    "components": ${componentsJson}
  }'`);
      commands.push('');
    }

    return commands;
  }
}

export const metaTemplateService = new MetaTemplateService();
