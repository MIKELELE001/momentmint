# ⚡ MomentMint — Autonomous Tipping Agent
### Tether Hackathon Galáctica: WDK Edition 1 | #HackathonGalactica

> **MomentMint** detects peak moments in Rumble livestreams and automatically
> tips creators via Tether WDK — zero manual input after setup.

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

---

## 🏗️ Project Structure

```
momentmint/
├── src/
│   ├── components/
│   │   ├── fan/              ← Fan dashboard, wallet, agent setup, tip feed
│   │   └── creator/          ← Creator earnings, top fans, live tips
│   ├── agent/
│   │   ├── momentDetector.ts ← AI moment detection logic
│   │   └── tipAgent.ts       ← Core agent loop
│   ├── services/
│   │   └── wdk.ts            ← WDK integration (dev: implement here)
│   └── types/index.ts        ← All TypeScript types
├── api/
│   └── analyze.ts            ← Claude AI — server-side only
├── .env.example
└── vercel.json
```

---

## 🔑 For The Dev — WDK Integration

**Only one file needs real implementation: `src/services/wdk.ts`**

Replace the mock functions with real Tether WDK calls:

```typescript
// Install WDK
npm install @tetherto/wdk @tetherto/wdk-wallet-evm

// Install WDK agent skills for OpenClaw
npx skills add tetherto/wdk-agent-skills
```

Functions to implement:
- `connectWallet()` — WDK wallet creation/restoration
- `getBalances()` — Live on-chain balances
- `sendTip()` — Sign and broadcast USDT/XAUt/BTC transaction
- `disconnectWallet()` — Clean disconnect

Everything else in the app already works around these.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 Agent Setup | Fan configures tip rules once — creator, amount, triggers, limits |
| ⚡ Moment Detection | AI detects chat spikes, milestones, keywords, celebrations |
| 💸 Auto Execution | WDK wallet tips creator instantly when moment detected |
| 📊 Fan Dashboard | Live activity feed, spending tracker, session stats |
| 🎬 Creator Dashboard | Live tip feed, top fans, earnings by moment type |
| 🔒 Spending Limits | Agent never exceeds fan's max per stream |
| ⏸️ Pause / Resume | Fan controls agent anytime |

---

## 🔒 Security

- `ANTHROPIC_API_KEY` — server-side only (`api/analyze.ts`), never in browser
- `WDK_API_KEY` — server-side only, never in browser
- No `VITE_` prefix on any sensitive key
- Self-custodial wallet — fan owns their keys via WDK
- `.env` protected by `.gitignore`

---

## 🏆 Contest

- **Hackathon:** Tether Hackathon Galáctica: WDK Edition 1
- **Track:** 💸 Tipping Bot
- **Prize target:** $3,000 (track) + $6,000 (overall) = $9,000 USDT
- **Deadline:** March 22, 2026
- **Submission:** DoraHacks

---

*MomentMint — because the best moments deserve instant rewards.*
