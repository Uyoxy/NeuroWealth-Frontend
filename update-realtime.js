const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/dashboard/RealtimeDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for useI18n
content = content.replace(
  'import { useToast } from "@/components/notifications/ToastProvider";',
  'import { useToast } from "@/components/notifications/ToastProvider";\nimport { useI18n } from "@/contexts/I18nContext";'
);

// We need to inject t inside RealtimeDashboard, EventLog, statusDot etc
// But statusLabel is outside the component, so we either pass t or move them inside
content = content.replace(
  'function statusLabel(status: StreamStatus) {',
  'function statusLabel(status: StreamStatus, t: any) {'
);
content = content.replace(
  'if (status === "running") return "Live";',
  'if (status === "running") return t.status.live;'
);
content = content.replace(
  'if (status === "stopped") return "Paused";',
  'if (status === "stopped") return t.status.paused;'
);
content = content.replace(
  'return "Idle";',
  'return t.status.idle;'
);

content = content.replace(
  'function EventLog({ events }: { events: StreamEvent[] }) {',
  'function EventLog({ events, t }: { events: StreamEvent[], t: any }) {'
);
content = content.replace(
  />\s*No events yet — start the stream to see live updates\.\s*<\/p>/,
  '>{t.noEvents}</p>'
);

content = content.replace(
  'export function RealtimeDashboard() {',
  'export function RealtimeDashboard() {\n  const { messages } = useI18n();\n  const t = messages.dashboard.realtime;'
);

content = content.replace(
  />\s*Simulated event stream\s*<\/span>/,
  '>{t.simulatedStream}</span>'
);
content = content.replace(
  />\s*Fires deposits, withdrawals, and rebalances every 4–9 s\s*<\/p>/,
  '>{t.firesEvery}</p>'
);

// We have multiple replace statusLabel(status) -> statusLabel(status, t)
content = content.replace(/\statusLabel\(status\)/g, 'statusLabel(status, t)');

content = content.replace(
  /aria-label="Start stream"[\s\S]*?>[\s\S]*?Start\s*<\/button>/,
  (match) => match.replace('Start', '{t.start}')
);

content = content.replace(
  /aria-label="Stop stream"[\s\S]*?>[\s\S]*?Stop\s*<\/button>/,
  (match) => match.replace('Stop', '{t.stop}')
);

content = content.replace(
  /aria-label="Reset stream"[\s\S]*?>[\s\S]*?Reset\s*<\/button>/,
  (match) => match.replace('Reset', '{t.reset}')
);

content = content.replace(
  /label="Events fired"/,
  'label={t.eventsFired}'
);
content = content.replace(
  /label="Δ Balance"/,
  'label={t.deltaBalance}'
);
content = content.replace(
  /label="Δ Yield"/,
  'label={t.deltaYield}'
);
content = content.replace(
  /label="Δ APY"/,
  'label={t.deltaApy}'
);
content = content.replace(
  />\s*Event log\s*<\/p>/,
  '>{t.eventLog}</p>'
);

content = content.replace(
  /<EventLog events={events} \/>/,
  '<EventLog events={events} t={t} />'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('updated realtime dashboard');
