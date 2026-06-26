const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/settings/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for useI18n
content = content.replace(
  'import { ThemeSettings } from "@/components/settings/ThemeSettings";',
  'import { ThemeSettings } from "@/components/settings/ThemeSettings";\nimport { useI18n } from "@/contexts/I18nContext";'
);

// 2. Change SettingsContent to accept messages or use useI18n internally
content = content.replace(
  'function SettingsContent() {',
  'function SettingsContent() {\n  const { messages } = useI18n();\n  const t = messages.settings.index;'
);

// 3. Replace strings
content = content.replace(/>Settings<\/h1>/, '>{t.title}</h1>');
content = content.replace(
  />\s*Manage your account preferences and connected wallet\.\s*<\/p>/,
  '>{t.subtitle}</p>'
);
content = content.replace(/title="Appearance"/, 'title={t.appearance.title}');
content = content.replace(/label="Theme"/, 'label={t.appearance.themeTitle}');
content = content.replace(/description="Choose between light, dark, or system preference."/, 'description={t.appearance.themeDesc}');

content = content.replace(/title="Profile"/, 'title={t.profile.title}');
content = content.replace(/label="Display Name & Preferences"/, 'label={t.profile.displayTitle}');
content = content.replace(/description="Edit your display name, locale, timezone, and currency format."/, 'description={t.profile.displayDesc}');
content = content.replace(/label="Edit profile"/, 'label={t.profile.editAction}');
content = content.replace(/label="Language & Region"/, 'label={t.profile.regionTitle}');
content = content.replace(/description="Change your locale and regional display settings."/, 'description={t.profile.regionDesc}');
content = content.replace(/label="Open"/, 'label={t.profile.openAction}');

content = content.replace(/title="Wallet"/, 'title={t.wallet.title}');
content = content.replace(/label="Connected Wallet"/, 'label={t.wallet.connectedTitle}');
content = content.replace(/description="Freighter wallet connection for signing transactions."/, 'description={t.wallet.connectedDesc}');
content = content.replace(/label="Network"/, 'label={t.wallet.networkTitle}');
content = content.replace(/description="Switch between Stellar Testnet and Mainnet."/, 'description={t.wallet.networkDesc}');

content = content.replace(/title="Notifications"/, 'title={t.notifications.title}');
content = content.replace(/label="Email Alerts"/, 'label={t.notifications.emailTitle}');
content = content.replace(/description="Receive email notifications for deposits, withdrawals, and rebalances."/, 'description={t.notifications.emailDesc}');
content = content.replace(/label="WhatsApp Notifications"/, 'label={t.notifications.whatsappTitle}');
content = content.replace(/description="Get updates via WhatsApp messaging."/, 'description={t.notifications.whatsappDesc}');

content = content.replace(/title="Security"/, 'title={t.security.title}');
content = content.replace(/label="Two-Factor Authentication"/, 'label={t.security.twoFactorTitle}');
content = content.replace(/description="Add an extra layer of security to your account."/, 'description={t.security.twoFactorDesc}');
content = content.replace(/label="Session Management"/, 'label={t.security.sessionTitle}');
content = content.replace(/description="View and revoke active sessions."/, 'description={t.security.sessionDesc}');

content = content.replace(/title="Region"/, 'title={t.region.title}');
content = content.replace(/label="Currency Display"/, 'label={t.region.currencyTitle}');
content = content.replace(/description="Choose your preferred display currency \(USD, EUR, GBP\)."/, 'description={t.region.currencyDesc}');
content = content.replace(/label="Open profile"/, 'label={t.region.openAction}');

// Update ComingSoonBadge
content = content.replace(
  'function ComingSoonBadge() {',
  'function ComingSoonBadge() {\n  const { messages } = useI18n();'
);
content = content.replace(
  />\s*Coming soon\s*<\/span>/,
  '>{messages.common.comingSoon}</span>'
);

// We need to change SettingsContent usage in SettingsPage
content = content.replace(
  'export default function SettingsPage() {',
  'export default function SettingsPage() {'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('updated settings page');
