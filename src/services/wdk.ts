import type { Asset, WalletState } from '../types';
import { WDK } from '@tetherto/wdk';

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

// ── Global WDK Instance & State ─────────────────────────────────────────────
let wdkInstance: WDK | null = null;
let mockWalletState: WalletState = {
  address: null,
  balances: { USDT: 0, XAUt: 0, BTC: 0 },
  isConnected: false,
  isLoading: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// REAL WDK CALLS
// ─────────────────────────────────────────────────────────────────────────────

export const connectWallet = async (): Promise<WalletState> => {
  if (!wdkInstance) {
    wdkInstance = new WDK({ network: 'mainnet' });
  }
  
  const wallet = await wdkInstance.wallet.create();
  
  mockWalletState = {
    address: wallet.address || '0xRestoredWDKWalletAddress',
    balances: { USDT: 0, XAUt: 0, BTC: 0 },
    isConnected: true,
    isLoading: false,
  };

  await getBalances();
  return mockWalletState;
};

export const getBalances = async (): Promise<Record<Asset, number>> => {
  if (!wdkInstance) return mockWalletState.balances;

  try {
    const liveBalances = await wdkInstance.wallet.getBalances();
    mockWalletState.balances = {
      USDT: liveBalances.USDT || 0,
      XAUt: liveBalances.XAUt || 0,
      BTC: liveBalances.BTC || 0,
    };
  } catch (error) {
    console.error("Failed to fetch WDK balances:", error);
  }

  return mockWalletState.balances;
};

export const sendTip = async (params: SendTipParams): Promise<TipResult> => {
  if (!wdkInstance) {
    return { success: false, txHash: null, error: 'Wallet missing or disconnected' };
  }

  try {
    const tx = await wdkInstance.wallet.send({
      to: params.toAddress,
      amount: params.amount,
      asset: params.asset,
      memo: params.memo,
    });

    await getBalances();
    return { success: true, txHash: tx.hash };
  } catch (err: any) {
    console.error("WDK transaction failed:", err);
    return { success: false, txHash: null, error: err.message || 'Tx Failed' };
  }
};

export const disconnectWallet = async (): Promise<void> => {
  wdkInstance = null;
  mockWalletState = {
    address: null,
    balances: { USDT: 0, XAUt: 0, BTC: 0 },
    isConnected: false,
    isLoading: false,
  };
};

export const getWalletState = (): WalletState => mockWalletState;
