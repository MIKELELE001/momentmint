import { useState } from 'react';
import type { WalletState, Asset } from '../../types';
import { connectWallet, disconnectWallet } from '../../services/wdk';

interface Props {
  wallet: WalletState;
  onWalletChange: (w: WalletState) => void;
}

const ASSET_COLORS: Record<Asset, string> = {
  USDT: '#10B981',
  XAUt: '#F59E0B',
  BTC: '#F97316',
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
      background: '#F0EBE1',
      borderRadius: 16,
      padding: 24,
      boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 800 }}>
          WDK Wallet
        </div>
        {wallet.isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E0F2FE', padding: '4px 10px', borderRadius: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA5E9', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: '#0369A1', fontWeight: 800, letterSpacing: '1px' }}>CONNECTED</span>
          </div>
        )}
      </div>

      {wallet.isConnected ? (
        <>
          <div style={{ fontSize: 13, color: '#4B5563', marginBottom: 20, fontFamily: "'DM Mono', monospace", fontWeight: 600, background: '#E5E0d8', padding: '10px 14px', borderRadius: 10, boxShadow: 'inset 2px 2px 5px #d1cabe, inset -2px -2px 5px #ffffff' }}>
            {shortAddress}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {(Object.keys(wallet.balances) as Asset[]).map(asset => (
              <div key={asset} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F0EBE1', boxShadow: '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 16, color: ASSET_COLORS[asset] }}>{ASSET_SYMBOLS[asset]}</span>
                  </div>
                  <span style={{ fontSize: 14, color: '#4B5563', fontWeight: 700 }}>{asset}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#111827', fontFamily: "'DM Mono', monospace" }}>
                  {wallet.balances[asset].toFixed(asset === 'BTC' ? 6 : 2)}
                </span>
              </div>
            ))}
          </div>
          <button onClick={handleDisconnect} style={{
            width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
            background: '#F0EBE1', color: '#6B7280', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Syne', sans-serif", letterSpacing: '1px',
            boxShadow: '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff', transition: 'all .2s'
          }}>
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={handleConnect} disabled={loading} style={{
          width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
          background: loading ? '#E5E0d8' : 'linear-gradient(135deg, #8B5CF6, #6B46C1)',
          color: loading ? '#9CA3AF' : '#fff', fontSize: 13, fontWeight: 800,
          cursor: loading ? 'wait' : 'pointer', fontFamily: "'Syne', sans-serif",
          letterSpacing: '1px', textTransform: 'uppercase',
          boxShadow: loading ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 12px rgba(107,70,193,0.3)',
        }}>
          {loading ? 'Connecting...' : '⚡ Connect WDK Wallet'}
        </button>
      )}
    </div>
  );
}
