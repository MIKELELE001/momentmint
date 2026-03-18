/**
 * ─── WDK Service Layer ───────────────────────────────────────────────────────
 * 
 * This is the ONLY file that touches Tether WDK.
 * Dev friend: implement the real WDK calls in this file.
 * Everything else in the app imports from here.
 * 
 * WDK Docs: https://docs.wdk.tether.io
 * Agent Skills: npx skills add tetherto/wdk-agent-skills
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Asset, WalletState } from '../types';

// ── Types ────────────────────────────────────────────────────────────────────
interface SendTipParams {
  toAddress: string;
  amount: number;
  asset: Asset;
  memo?: string;
}

interface TipResult {
  success: boolean;
  txHash: string | null;
  error?: string;
}

// ── Mock state (replace with real WDK wallet state) ──────────────────────────
let mockWalletState: WalletState = {
  address: null,
  balances: { USDT: 0, XAUt: 0, BTC: 0 },
  isConnected: false,
  isLoading: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// DEV FRIEND: Replace these mock implementations with real WDK calls
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create or restore a WDK self-custodial wallet
 * Real impl: use WDK wallet creation primitives
 */
export const connectWallet = async (): Promise<WalletState> => {
  // TODO: Replace with real WDK wallet connection
  // import { WDK } from '@tetherto/wdk'
  // const wdk = new WDK({ network: 'mainnet' })
  // const wallet = await wdk.wallet.create()
  
  await new Promise(r => setTimeout(r, 1200)); // simulate loading
  mockWalletState = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fA3e',
    balances: { USDT: 142.50, XAUt: 0.08, BTC: 0.002 },
    isConnected: true,
    isLoading: false,
  };
  return mockWalletState;
};

/**
 * Get current wallet balances
 * Real impl: query WDK for live on-chain balances
 */
export const getBalances = async (): Promise<Record<Asset, number>> => {
  // TODO: Replace with real WDK balance query
  // const balances = await wdk.wallet.getBalances()
  return mockWalletState.balances;
};

/**
 * Send a tip to a creator
 * Real impl: sign and broadcast transaction via WDK
 * This is the CORE function — all tips flow through here
 */
export const sendTip = async (params: SendTipParams): Promise<TipResult> => {
  // TODO: Replace with real WDK transaction
  // const tx = await wdk.wallet.send({
  //   to: params.toAddress,
  //   amount: params.amount,
  //   asset: params.asset,
  //   memo: params.memo,
  // })
  // return { success: true, txHash: tx.hash }

  await new Promise(r => setTimeout(r, 800)); // simulate tx time
  
  // Deduct from mock balance
  if (mockWalletState.balances[params.asset] < params.amount) {
    return { success: false, txHash: null, error: 'Insufficient balance' };
  }
  mockWalletState.balances[params.asset] -= params.amount;
  
  // Return mock tx hash
  const mockHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
  return { success: true, txHash: mockHash };
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = async (): Promise<void> => {
  // TODO: Replace with real WDK disconnect
  mockWalletState = {
    address: null,
    balances: { USDT: 0, XAUt: 0, BTC: 0 },
    isConnected: false,
    isLoading: false,
  };
};

export const getWalletState = (): WalletState => mockWalletState;
