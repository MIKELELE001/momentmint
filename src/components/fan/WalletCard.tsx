import { useState } from 'react';
import type { WalletState, Asset } from '../../types';
import { connectWallet, disconnectWallet } from '../../services/wdk';

interface Props {
  wallet: WalletState;
  onWalletChange: (w: WalletState) => void;
}

const ASSET_COLORS: Record<Asset, string> = {
  USDT: '#26A17B',
  XAUt: '#F0B90B',
  BTC: '#F7931A',
};

const ASSET_SYMBOLS: Record<Asset, string> = {
  USDT: '₮',
  XAUt: '⚜',
  BTC: '₿',
};

export default function WalletCard({ wallet, onWalletChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const w = await connectWallet();
      onWalletChange(w);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    onWalletChange({ address: null, balances: { USDT: 0, XAUt: 0, BTC: 0 }, isConnected: false, isLoading: false });
  };

  const shortAddress = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : null;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          WDK Wallet
        </div>
        {wallet.isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3a5', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: '#22d3a5', fontWeight: 700, letterSpacing: '1px' }}>CONNECTED</span>
          </div>
        )}
      </div>

      {wallet.isConnected ? (
        <>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
            {shortAddress}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {(Object.keys(wallet.balances) as Asset[]).map(asset => (
              <div key={asset} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: ASSET_COLORS[asset] }}>{ASSET_SYMBOLS[asset]}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{asset}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'DM Mono', monospace" }}>
                  {wallet.balances[asset].toFixed(asset === 'BTC' ? 6 : 2)}
                </span>
              </div>
            ))}
          </div>
          <button onClick={handleDisconnect} style={{
            width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 11,
            cursor: 'pointer', fontFamily: "'Syne', sans-serif", letterSpacing: '1px',
          }}>
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={handleConnect} disabled={loading} style={{
          width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
          background: loading ? 'rgba(38,161,123,0.15)' : 'linear-gradient(135deg, #26A17B, #1a7a5e)',
          color: loading ? '#26A17B' : '#fff', fontSize: 12, fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer', fontFamily: "'Syne', sans-serif",
          letterSpacing: '1px', textTransform: 'uppercase',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(38,161,123,0.3)',
        }}>
          {loading ? 'Connecting...' : '⚡ Connect WDK Wallet'}
        </button>
      )}
    </div>
  );
}
