NeuroWealth 💰

AI-Powered DeFi Yield Platform on Stellar

NeuroWealth is an autonomous AI investment agent that automatically manages and grows your crypto assets on the Stellar blockchain. Deposit once, let the AI find the best yield opportunities across Stellar's DeFi ecosystem — and withdraw anytime with no lock-ups.

Overview
Traditional savings accounts offer near-zero interest. Traditional DeFi is too complex for most users. NeuroWealth bridges the gap a simple chat interface web powered by an AI agent that autonomously deploys your funds into the highest-yielding, safest opportunities on Stellar.

Why Stellar?

Transaction fees of fractions of a penny — perfect for frequent AI-driven rebalancing
3–5 second finality — the AI can act on market changes instantly
Native DEX + Soroban smart contracts — composable, programmable yield strategies
Native USDC + XLM — borderless capital movement with no friction
Growing DeFi ecosystem — Blend (lending), Templar (borrowing), RWA protocols

Features
FeatureDescription🤖 AI AgentAutonomous 24/7 yield optimization across Stellar DeFi💬 Natural LanguageChat to deposit, withdraw, and check balances📈 Auto-RebalancingAgent shifts funds to best opportunities automatically🔐 Non-CustodialYour funds live in audited Soroban smart contracts⚡ Instant WithdrawalsNo lock-ups, no penalties, withdraw anytime📱 WhatsApp ReadyFull functionality through WhatsApp chat interface🌍 Global AccessNo geographic restrictions, no bank account required🛡️ Security FirstSoroban contracts with ReentrancyGuard and access controls

How It Works

1. User deposits USDC via web app
   ↓
2. Soroban vault contract receives and records the deposit
   ↓
3. Contract emits a deposit event
   ↓
4. AI agent detects the event and deploys funds to best protocol (e.g. Blend)
   ↓
5. Yield accumulates 24/7 — agent rebalances hourly if better opportunities exist
   ↓
6. User requests withdrawal anytime → agent pulls funds → sends back in seconds
   Three Investment Strategies

Conservative — Stablecoin lending on Blend. Low risk, steady 3–6% APY.
Balanced — Mix of lending + DEX liquidity provision. Medium risk, 6–10% APY.
Growth — Aggressive multi-protocol deployment. Higher risk, 10–15% APY.

Tech Stack
Smart Contracts

Language: Rust (Soroban SDK 21.0.0)
Standard: ERC-4626 inspired vault architecture
Network: Stellar Mainnet / Testnet
Security: OpenZeppelin-equivalent patterns (ReentrancyGuard, Pausable, Access Control)

Backend / AI Agent

Runtime: Node.js or Python
Stellar SDK: @stellar/stellar-sdk
AI: Claude API / OpenAI for natural language intent parsing
Database: PostgreSQL / Supabase for user position tracking
Queue: Bull / Redis for reliable transaction processing

Frontend

Framework: Next.js 15
Blockchain: Stellar SDK + Freighter wallet integration
Styling: Tailwind CSS
Charts: Recharts for portfolio analytics

Integrations

Yield Protocols: Blend Protocol (lending), Stellar DEX (liquidity)
Price Feeds: Stellar anchor price feeds

Project Structure
neurowealth/
├── contracts/ # Soroban smart contracts (Rust)
│ └── vault/
│ ├── Cargo.toml
│ └── src/
│ └── lib.rs # Core vault contract
├── agent/ # AI agent backend
│ ├── index.ts # Agent entry point
│ ├── stellar.ts # Stellar transaction helpers
│ ├── strategies/ # Yield strategy logic
│ │ ├── conservative.ts
│ │ ├── balanced.ts
│ │ └── growth.ts
│ ├── protocols/ # DeFi protocol integrations
│ │ └── blend.ts
│ └── nlp/ # Natural language intent parsing
│ └── parser.ts
├── frontend/ # Next.js web app
│ ├── app/
│ ├── components/
│ └── lib/
├── whatsapp/ # WhatsApp bot handler
│ ├── webhook.ts
│ └── responses.ts
├── scripts/ # Deployment and utility scripts
│ ├── deploy.sh
│ └── initialize.sh
└── README.md

WhatsApp Integration
NeuroWealth is designed to be fully operable through WhatsApp, making it accessible to anyone with a smartphone — no wallet app or browser extension needed.
User Flow

1. User sends "hi" to NeuroWealth WhatsApp number
2. Bot introduces itself and asks for phone number verification (OTP)
3. OTP verified → agent creates a Stellar keypair for this user (custodial)
4. User can now deposit, withdraw, and check balance entirely through chat
5. Funds are secured in the Soroban vault contract under their wallet address
   Setting Up the Webhook
   bash# Your webhook endpoint receives WhatsApp messages
   POST /api/whatsapp/webhook

# Register your webhook URL with Twilio

# ngrok http 3000 ← for local testing

Example Conversation
User: deposit 100 USDC
Agent: Got it! Depositing 100 USDC into your Balanced strategy.
This should take about 5 seconds on Stellar... ✅ Done!
You're now earning ~8.4% APY. I'll optimize automatically.

User: what's my balance?
Agent: 💰 Your NeuroWealth Portfolio
Balance: 100.23 USDC
Earnings today: +$0.23
Current APY: 8.4%
Strategy: Balanced

User: withdraw everything
Agent: Withdrawing 100.23 USDC... ✅ Done!
Funds sent to your wallet. Arrived in 4 seconds.

## Getting Started

### Package Manager

This project uses **Yarn** as the package manager. The version is specified in `package.json`:

```json
"packageManager": "yarn@1.22.22+sha512.a6b2f7906b721bba3d67d4aff083df04dad64c399707841b7acf00f6b133b7ac24255f2652fa22ae3534329dc6180534e98d17432037ff6fd140556e2bb3137e"
```

**Installation:**

- Install Yarn globally: `npm install -g yarn`
- Or use Corepack (Node.js 16.9+): `corepack enable`

**Common Commands:**

```bash
yarn install          # Install dependencies
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn qa:visual-baseline  # Capture visual test baselines
```

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/NeuroWealth/NeuroWealth-Frontend.git
   cd NeuroWealth-Frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

The app will be available at `http://localhost:3000`

## Environment Variables

### Required Environment Variables

```bash
# Meta WhatsApp Cloud API
WHATSAPP_APP_SECRET=your_meta_app_secret_here
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here
WHATSAPP_ACCESS_TOKEN=EAA...your_token_here
WHATSAPP_PHONE_NUMBER_ID=1015554021640186
WHATSAPP_WABA_ID=871074939257642

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neurowealth
DB_USER=postgres
DB_PASSWORD=your_database_password_here

# Stellar Network
STELLAR_NETWORK=testnet  # or 'mainnet'
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Wallet Encryption
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
WALLET_ENCRYPTION_KEY=your_64_character_hex_string_here
```

### Database Setup

1. Install PostgreSQL (version 12 or higher)
2. Create the database:
   ```bash
   createdb neurowealth
   ```
3. Run migrations:
   ```bash
   psql -d neurowealth -f backend/migrations/001_create_users_table.sql
   psql -d neurowealth -f backend/migrations/002_create_deposits_table.sql
   ```

### Stellar Network Configuration

- **Testnet**: Use `https://horizon-testnet.stellar.org` for development
- **Mainnet**: Use `https://horizon.stellar.org` for production

The deposit monitor will automatically connect to the configured Horizon endpoint and stream payment events for all registered user wallet addresses.

## Deposit Detection System

The deposit detection system monitors user Stellar wallet addresses for incoming USDC deposits in real-time using the Horizon streaming API.

### How It Works

1. **Monitoring**: When a user completes onboarding and receives a wallet address, the deposit monitor establishes a streaming connection to Horizon API
2. **Detection**: USDC deposits are detected within 10 seconds of Stellar confirmation
3. **Recording**: Deposits are recorded in PostgreSQL with idempotency (duplicate transactions are ignored)
4. **Notification**: Users receive WhatsApp confirmation messages at two stages:
   - "Deposit Received" - immediately after detection
   - "Funds Deployed" - after AI agent deploys funds to yield strategy
5. **Deployment**: The system emits deployment events for external AI agent handlers

### Key Features

- Real-time streaming with automatic reconnection
- Exponential backoff for connection failures (1s to 60s max)
- Transaction hash-based idempotency
- Atomic database transactions for portfolio updates
- Graceful error handling with user notifications

### Services

- **Deposit Monitor**: Streams payment events from Stellar Horizon
- **Deposit Recorder**: Records deposits in database with idempotency
- **Deployment Coordinator**: Emits deployment events and handles confirmations
- **Deposit Messaging**: Sends WhatsApp notifications for deposit lifecycle events
