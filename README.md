# ⚡ MomentMint
**Autonomous Tipping Agent for Live Creators**

---

## Overview

MomentMint is an AI-powered agent that detects peak moments in live streams and automatically tips creators through a self-custodial Tether WDK wallet — with zero manual input after setup.

Fans set their rules once. The agent does the rest.

---

## The Problem

Tipping during a livestream is manual and slow. By the time a fan reaches for their wallet, the moment is gone. Creators miss revenue at their most engaging moments. The emotional impulse and the financial action are disconnected.

---

## How It Works

```
WATCH stream → DETECT moment → CHECK rules → VERIFY balance → EXECUTE tip → LOG on-chain → REPEAT
```

A fan configures their agent once:
- Which creator to watch
- How much to tip per moment
- What triggers a tip — chat explosion, viewer milestone, keyword, celebration
- Maximum spend per stream

The agent runs autonomously, reasoning about each stream snapshot and executing tips through a Tether WDK self-custodial wallet when conditions are met.

---

## Features

**Fan Dashboard**
- Connect self-custodial WDK wallet — USDT, XAU₮, BTC
- Configure agent rules with custom triggers and spending limits
- Real-time activity feed of every tip fired
- Live budget tracker with progress bar
- Pause, resume, or stop agent at any time

**Creator Dashboard**
- Live tip notifications during streams
- Top fans leaderboard
- Earnings breakdown by moment type
- Full transaction history

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Agent Framework | OpenClaw |
| Wallet & Transactions | Tether WDK |
| AI Moment Detection | Claude (Anthropic) |
| Frontend | React + TypeScript |
| Deployment | Vercel |

---

## Security

- All API keys are server-side only — never exposed in the browser bundle
- Self-custodial wallet — user owns their keys via WDK
- Spending limits enforced by agent logic before every transaction
- No transactions execute without explicit user-configured consent

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your keys to .env
# ANTHROPIC_API_KEY=your_key_here
# WDK_API_KEY=your_key_here

# Start development server
npm run dev
```

---

## Project Structure

```
src/
├── components/
│   ├── fan/              # Fan dashboard, wallet, agent setup, tip feed
│   └── creator/          # Creator earnings and live tip feed
├── agent/
│   ├── tipAgent.ts       # Core agent loop
│   └── momentDetector.ts # AI moment detection logic
├── services/
│   └── wdk.ts            # Tether WDK integration layer
└── types/                # TypeScript types
api/
└── analyze.ts            # Server-side AI analysis
```

---

## WDK Integration

All wallet logic is isolated in `src/services/wdk.ts`. This is the single integration point for Tether WDK — wallet creation, balance queries, and transaction signing all live here.

```bash
# Install Tether WDK
npm install @tetherto/wdk @tetherto/wdk-wallet-evm

# Install WDK agent skills
npx skills add tetherto/wdk-agent-skills
```

---

*MomentMint — the best moments deserve instant rewards.*