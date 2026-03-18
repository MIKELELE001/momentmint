# ⚡ MomentMint
**Autonomous Tipping Agent for Rumble Creators**

> Built for Tether Hackathon Galáctica: WDK Edition 1 | Track: 💸 Tipping Bot

---

## The Problem

Tipping on Rumble is manual. By the time a fan reaches for their wallet, the moment is gone.

Creators miss out on revenue at their most engaging moments. Fans forget to tip even when they want to. The emotional impulse and the financial action are disconnected.

## The Solution

MomentMint is an AI agent that watches a Rumble livestream and automatically tips the creator the moment something exciting happens — no manual input required.

A fan sets their rules once:
- Which creator to watch
- How much to tip per moment
- What counts as a moment (chat explosion, milestone, keyword, celebration)
- Maximum spend per stream

The agent does the rest — detecting moments, executing tips through a Tether WDK self-custodial wallet, and logging every transaction on-chain.

---

## How It Works

```
WATCH stream → DETECT moment → CHECK rules → VERIFY balance → EXECUTE tip → LOG on-chain → REPEAT
```

The agent runs continuously, reasoning about each stream snapshot:
- Is this moment significant enough?
- Does it match the fan's trigger rules?
- Is there sufficient balance?
- Has the spending limit been reached?

---

## Features

**Fan Side**
- Connect self-custodial WDK wallet (USDT, XAU₮, BTC)
- Configure agent rules — triggers, tip amount, spending limit
- Real-time activity feed showing every tip fired
- Live spending tracker with budget progress bar
- Pause, resume, or stop agent at any time

**Creator Side**
- Live tip notifications during streams
- Top fans leaderboard
- Earnings breakdown by moment type
- Transaction history

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Agent Framework | OpenClaw |
| Wallet & Transactions | Tether WDK |
| AI Moment Detection | Claude (Anthropic) — server-side only |
| Frontend | React + TypeScript |
| Deployment | Vercel |

---

## Security

- All API keys are server-side only — never exposed in the browser
- Self-custodial wallet — fan owns their keys via WDK
- Spending limits enforced by agent logic
- No auto-trading without explicit fan consent

---

## Running Locally

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
│   ├── fan/          # Fan dashboard, wallet, agent setup, tip feed
│   └── creator/      # Creator earnings and live tip feed
├── agent/
│   ├── tipAgent.ts       # Core agent loop
│   └── momentDetector.ts # Moment detection logic
├── services/
│   └── wdk.ts        # Tether WDK integration layer
└── types/            # TypeScript types
api/
└── analyze.ts        # Server-side Claude AI analysis
```

---

## Hackathon

- **Event:** Tether Hackathon Galáctica: WDK Edition 1
- **Track:** 💸 Tipping Bot
- **Submission Deadline:** March 22, 2026
- **Platform:** DoraHacks

---

*MomentMint — the best moments deserve instant rewards.*