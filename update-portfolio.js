const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/PortfolioDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for useI18n
content = content.replace(
  'import { AllocationChart } from "./AllocationChart";',
  'import { AllocationChart } from "./AllocationChart";\nimport { useI18n } from "@/contexts/I18nContext";'
);

// We need to inject t into `renderSourceLabel` but it is outside of the component.
content = content.replace(
  'function renderSourceLabel(source: PortfolioPayload["source"]) {',
  'function renderSourceLabel(source: PortfolioPayload["source"], t: any) {'
);
content = content.replace(
  'return "Live backend";',
  'return t.liveWidgets;'
);
content = content.replace(
  'return "Fallback demo";',
  'return t.emptyStates;'
);
content = content.replace(
  'return "Preview data";',
  'return "Preview data";'
);

content = content.replace(
  'export function PortfolioDashboard() {',
  'export function PortfolioDashboard() {\n  const { messages } = useI18n();\n  const t = messages.dashboard.portfolio;'
);

// Replace strings in JSX
content = content.replace(/>\s*Portfolio widgets\s*<\/span>/, '>{t.overview.split(" ")[0]} widgets</span>');
content = content.replace(/>\s*NeuroWealth overview\s*<\/h2>/, '>{t.overview}</h2>');
content = content.replace(/>\s*Total balance, yield, APY, strategy, allocation, and recent activity in a single review surface with measurable light and dark theme parity\.\s*<\/p>/, '>{t.overviewDesc}</p>');

content = content.replace(/>\s*Theme preview\s*<\/p>/, '>{t.themePreview}</p>');
content = content.replace(/{option === "light" \? "Light mode" : "Dark mode"}/, '{option === "light" ? t.lightMode : t.darkMode}');

content = content.replace(/>\s*Scenario preview\s*<\/p>/, '>{t.scenarioPreview}</p>');
content = content.replace(/label: "Live widgets"/, 'label: t.liveWidgets');
content = content.replace(/label: "Empty states"/, 'label: t.emptyStates');

content = content.replace(/"Loading portfolio widget state..."/, 't.loadingWidget');
content = content.replace(/"Syncing portfolio data"/, 't.syncingData');
content = content.replace(/>\s*Sandbox:/, '>{t.sandbox}:');
content = content.replace(/>\s*Theme:/, '>{t.theme}:');
content = content.replace(/>\s*Source:/, '>{t.source}:');
content = content.replace(/renderSourceLabel\(portfolio\.source\)/, 'renderSourceLabel(portfolio.source, t)');

content = content.replace(/>\s*Portfolio widgets unavailable\s*<\/h2>/, '>{t.unavailableTitle}</h2>');
content = content.replace(/{error} The dashboard can retry once connectivity to the\s*portfolio API is restored\./, '{error} {t.unavailableDesc}');
content = content.replace(/>\s*Retry widgets\s*<\/button>/, '>{t.retryWidgets}</button>');

content = content.replace(/>\s*Asset allocation\s*<\/h2>/, '>{t.allocationTitle}</h2>');
content = content.replace(/>\s*Visible deployment mix across strategy buckets and\s*reserve capital\.\s*<\/p>/, '>{t.allocationDesc}</p>');

content = content.replace(/{portfolio.allocation.length === 1 \? " line" : " lines"}/, '{portfolio.allocation.length === 1 ? " " + t.line : " " + t.lines}');

content = content.replace(/copy="No allocation yet\. Add a deposit to see deployed positions and reserve coverage\."/, 'copy={t.emptyAllocation}');
content = content.replace(/cta="Load sample data"/g, 'cta={t.loadSample}');

content = content.replace(/>\s*Recent activity\s*<\/h2>/, '>{t.activityTitle}</h2>');
content = content.replace(/>\s*Latest deposits, yield events, rebalances, and scheduled\s*cash flows\.\s*<\/p>/, '>{t.activityDesc}</p>');
content = content.replace(/{portfolio.activity.length === 1 \? "" : "s"}/, '{portfolio.activity.length === 1 ? " " + t.event : " " + t.events}');
content = content.replace(/event\{portfolio\.activity\.length === 1 \? "" : "s"\}/, '{portfolio.activity.length === 1 ? t.event : t.events}');
content = content.replace(/{portfolio\.activity\.length} event\s*{portfolio\.activity\.length === 1 \? "" : "s"}/, '{portfolio.activity.length} {portfolio.activity.length === 1 ? t.event : t.events}');


content = content.replace(/"No amount"/, 't.noAmount');

content = content.replace(/copy="No recent activity yet\. Deposits and rebalances will appear here as soon as they happen\."/, 'copy={t.emptyActivity}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('updated portfolio dashboard');
