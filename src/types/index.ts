// ─── Core Types for MomentMint ───────────────────────────────────────────────

export type Asset = 'USDT' | 'XAUt' | 'BTC';

export type MomentType =
  | 'milestone'
  | 'engagement_spike'
  | 'keyword'
  | 'celebration'
  | 'donation_goal';

export type AgentStatus = 'idle' | 'watching' | 'paused' | 'executing';

export interface TipRule {
  id: string;
  creatorId: string;
  creatorName: string;
  tipAmount: number;
  asset: Asset;
  maxPerStream: number;
  triggers: MomentType[];
  keywords: string[];
  isActive: boolean;
}

export interface TipEvent {
  id: string;
  timestamp: number;
  creatorId: string;
  creatorName: string;
  amount: number;
  asset: Asset;
  momentType: MomentType;
  momentDescription: string;
  txHash: string | null;     // null until confirmed on-chain
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WalletState {
  address: string | null;
  balances: Record<Asset, number>;
  isConnected: boolean;
  isLoading: boolean;
}

export interface AgentState {
  status: AgentStatus;
  currentCreator: string | null;
  spentThisStream: number;
  tipsThisStream: number;
  lastMoment: string | null;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  isLive: boolean;
  viewerCount: number;
  streamTitle: string;
  totalEarned: number;
  tipsToday: number;
}

export interface StreamMoment {
  id: string;
  timestamp: number;
  type: MomentType;
  description: string;
  confidence: number;       // 0-1, how confident the AI is
  triggered: boolean;       // did it fire a tip?
}
