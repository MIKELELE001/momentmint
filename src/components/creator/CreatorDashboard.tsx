import { useState, useEffect } from 'react';
import type { TipEvent } from '../../types';

// Mock creator data — dev friend connects to real WDK wallet
const MOCK_CREATOR = {
  id: 'c1',
  name: 'CryptoKing_Live',
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fA3e',
  totalEarned: 1284.50,
  tipsToday: 47,
  topFans: [
    { name: 'whale_watcher', tips: 12, amount: 48, asset: 'USDT' },
    { name: 'defi_degen', tips: 8, amount: 32, asset: 'USDT' },
    { name: 'xaut_holder', tips: 3, amount: 0.15, asset: 'XAUt' },
    { name: 'btc_maxi', tips: 5, amount: 0.008, asset: 'BTC' },
    { name: 'moment_fan', tips: 19, amount: 38, asset: 'USDT' },
  ],
};

const genMockTips = (): TipEvent[] =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `tip-${i}`,
    timestamp: Date.now() - i * 180000,
    creatorId: 'c1',
    creatorName: 'CryptoKing_Live',
    amount: [1, 2, 5, 10][Math.floor(Math.random() * 4)],
    asset: ['USDT', 'USDT', 'USDT', 'XAUt', 'BTC'][Math.floor(Math.random() * 5)] as any,
    momentType: ['engagement_spike', 'milestone', 'keyword', 'celebration'][Math.floor(Math.random() * 4)] as any,
    momentDescription: ['Chat exploded — 48 msgs/min', '1,000 viewers milestone!', 'Keyword "insane" detected', 'Celebration moment!'][Math.floor(Math.random() * 4)],
    txHash: `0x${Math.random().toString(16).slice(2)}`,
    status: 'confirmed',
  }));

const MOMENT_EMOJIS: Record<string, string> = {
  engagement_spike: '⚡', milestone: '🏆', keyword: '🎯', celebration: '🎉',
};

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

export default function CreatorDashboard({ tips: externalTips }: { tips: TipEvent[] }) {
  const [tips] = useState<TipEvent[]>(() => externalTips.length > 0 ? externalTips : genMockTips());
  const [liveTip, setLiveTip] = useState<TipEvent | null>(null);

  // Simulate incoming live tips
  useEffect(() => {
    const amounts = [1, 2, 5];
    const interval = setInterval(() => {
      const tip: TipEvent = {
        id: `live-${Date.now()}`,
        timestamp: Date.now(),
        creatorId: 'c1',
        creatorName: 'CryptoKing_Live',
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        asset: 'USDT',
        momentType: 'engagement_spike',
        momentDescription: 'Chat exploded',
        txHash: `0x${Math.random().toString(16).slice(2)}`,
        status: 'confirmed',
      };
      setLiveTip(tip);
      setTimeout(() => setLiveTip(null), 3000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const totalToday = tips.filter(t => t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);
  const byMoment = tips.reduce((acc, t) => {
    acc[t.momentType] = (acc[t.momentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Live tip notification */}
      {liveTip && (
        <div style={{
          padding: '14px 20px', borderRadius: 14, animation: 'fadeUp .3s ease',
          background: 'rgba(38,161,123,0.12)', border: '1px solid rgba(38,161,123,0.35)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 24 }}>💸</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>
              New tip received! +{liveTip.amount} {liveTip.asset}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              Triggered by: {liveTip.momentDescription}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, color: '#26A17B', fontFamily: "'DM Mono', monospace" }}>
            +{liveTip.amount} ₮
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Earned', value: `$${MOCK_CREATOR.totalEarned.toLocaleString()}`, color: '#26A17B' },
          { label: 'Tips Today', value: MOCK_CREATOR.tipsToday, color: '#fff' },
          { label: 'Today Revenue', value: `$${totalToday.toFixed(2)}`, color: '#F0B90B' },
          { label: 'Avg Tip', value: `$${(totalToday / tips.length).toFixed(2)}`, color: '#22d3a5' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top fans */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Top Fans</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_CREATOR.topFans.map((fan, i) => (
              <div key={fan.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: i === 0 ? 'rgba(240,185,11,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 0 ? 'rgba(240,185,11,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ fontSize: 14, width: 24, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{fan.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{fan.tips} tips</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#26A17B', fontFamily: "'DM Mono', monospace" }}>
                  {fan.amount} {fan.asset}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moment breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Tips by Moment Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(byMoment).map(([type, count]) => {
              const pct = Math.round((count / tips.length) * 100);
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{MOMENT_EMOJIS[type]} {type.replace('_', ' ')}</span>
                    <span style={{ fontSize: 11, color: '#26A17B', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{count}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#26A17B', borderRadius: 3, transition: 'width .5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent tips */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Recent Tips</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 300, overflowY: 'auto' }}>
          {tips.slice(0, 10).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{MOMENT_EMOJIS[t.momentType]}</span>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{t.momentDescription}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{timeAgo(t.timestamp)}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#26A17B', fontFamily: "'DM Mono', monospace" }}>
                +{t.amount} {t.asset}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
