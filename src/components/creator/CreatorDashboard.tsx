import { useState, useEffect, memo, useMemo } from 'react';
import type { TipEvent } from '../../types';

// Mock creator data
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

export default memo(function CreatorDashboard({ tips: externalTips }: { tips: TipEvent[] }) {
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

  const totalToday = useMemo(() => tips.filter(t => t.status === 'confirmed').reduce((s, t) => s + t.amount, 0), [tips]);
  const byMoment = useMemo(() => tips.reduce((acc, t) => {
    acc[t.momentType] = (acc[t.momentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>), [tips]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Live tip notification (Glassmorphic) */}
      {liveTip && (
        <div style={{
          padding: '16px 24px', borderRadius: 16, animation: 'fadeUp .4s ease',
          background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '4px 4px 10px rgba(16,185,129,0.3)' }}>💸</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
              New tip received! +{liveTip.amount} {liveTip.asset}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: 600 }}>
              Triggered by: {liveTip.momentDescription}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 28, fontWeight: 800, color: '#10B981', fontFamily: "'DM Mono', monospace" }}>
            +{liveTip.amount} ₮
          </div>
        </div>
      )}

      {/* Stats row - Neumorphic Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {[
          { label: 'Total Earned', value: `$${MOCK_CREATOR.totalEarned.toLocaleString()}`, color: '#6B46C1' },
          { label: 'Tips Today', value: MOCK_CREATOR.tipsToday, color: '#111827' },
          { label: 'Today Revenue', value: `$${totalToday.toFixed(2)}`, color: '#F59E0B' },
          { label: 'Avg Tip', value: `$${(totalToday / tips.length).toFixed(2)}`, color: '#10B981' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F0EBE1', borderRadius: 16, padding: '20px 24px', boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' }}>
            <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Top fans */}
        <div style={{ background: '#F0EBE1', borderRadius: 20, padding: 28, boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' }}>
          <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 800 }}>Top Fans</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_CREATOR.topFans.map((fan, i) => (
              <div key={fan.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: '#F0EBE1', boxShadow: i === 0 ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff' }}>
                <div style={{ fontSize: 16, width: 28, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={{ fontSize: 13, fontWeight: 800, color: '#9CA3AF' }}>#{i + 1}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{fan.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3, fontWeight: 600 }}>{fan.tips} tips</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#6B46C1', fontFamily: "'DM Mono', monospace" }}>
                  {fan.amount} {fan.asset}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moment breakdown */}
        <div style={{ background: '#F0EBE1', borderRadius: 20, padding: 28, boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' }}>
          <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 800 }}>Tips by Moment Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(byMoment).map(([type, count]) => {
              const pct = Math.round((count / tips.length) * 100);
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#4B5563', fontWeight: 700 }}>{MOMENT_EMOJIS[type]} {type.replace('_', ' ')}</span>
                    <span style={{ fontSize: 13, color: '#6B46C1', fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{count}</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(0,0,0,0.05)', borderRadius: 4, boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #A78BFA, #6B46C1)', borderRadius: 4, transition: 'width .5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent tips */}
      <div style={{ background: '#F0EBE1', borderRadius: 20, padding: 28, boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' }}>
        <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 800 }}>Recent Tips</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
          {tips.slice(0, 10).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 12, background: '#F0EBE1', boxShadow: 'inset 2px 2px 5px #d1cabe, inset -2px -2px 5px #ffffff', borderLeft: '4px solid #10B981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 5px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 18 }}>{MOMENT_EMOJIS[t.momentType]}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#111827', fontWeight: 800 }}>{t.momentDescription}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3, fontWeight: 600 }}>{timeAgo(t.timestamp)}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#10B981', fontFamily: "'DM Mono', monospace" }}>
                +{t.amount} {t.asset}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
