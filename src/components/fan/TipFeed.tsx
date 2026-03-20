import type { TipEvent, StreamMoment } from '../../types';

interface Props {
  tips: TipEvent[];
  moments: StreamMoment[];
}

const MOMENT_EMOJIS: Record<string, string> = {
  engagement_spike: '⚡',
  milestone: '🏆',
  keyword: '🎯',
  celebration: '🎉',
  donation_goal: '💰',
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#10B981',
  pending: '#F59E0B',
  failed: '#EF4444',
};

const timeAgo = (ts: number): string => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

export default function TipFeed({ tips, moments }: Props) {
  const allEvents = [
    ...tips.map(t => ({ ...t, _type: 'tip' as const })),
    ...moments.filter(m => !m.triggered).map(m => ({ ...m, _type: 'moment' as const })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);

  if (allEvents.length === 0) {
    return (
      <div style={{
        background: '#F0EBE1', borderRadius: 16, padding: '40px 20px', textAlign: 'center',
        boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff'
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>👁️</div>
        <div style={{ fontSize: 13, color: '#6B7280', letterSpacing: '1px', fontWeight: 700 }}>
          Agent is watching for moments...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#F0EBE1', borderRadius: 16, padding: 24,
      boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff',
      height: '100%', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 800 }}>
        Live Activity Feed
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1, paddingRight: 4 }}>
        {allEvents.map((event, i) => {
          if (event._type === 'tip') {
            const tip = event as TipEvent & { _type: 'tip' };
            return (
              <div key={tip.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', borderRadius: 12, animation: i === 0 ? 'fadeUp .4s ease' : 'none',
                background: '#F0EBE1',
                boxShadow: 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff',
                borderLeft: `4px solid #6B46C1`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 5px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: 18 }}>{MOMENT_EMOJIS[tip.momentType] || '💸'}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>
                      Tipped {tip.creatorName}
                    </div>
                    <div style={{ fontSize: 11, color: '#4B5563', marginTop: 3, fontWeight: 600 }}>
                      {tip.momentDescription}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#6B46C1', fontFamily: "'DM Mono', monospace" }}>
                    +{tip.amount} {tip.asset}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[tip.status] }} />
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{timeAgo(tip.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          } else {
            const moment = event as StreamMoment & { _type: 'moment' };
            return (
              <div key={moment.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', borderRadius: 10,
                background: '#F0EBE1', 
                boxShadow: 'inset 2px 2px 5px #d1cabe, inset -2px -2px 5px #ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, opacity: 0.6 }}>{MOMENT_EMOJIS[moment.type] || '👁️'}</span>
                  <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{moment.description}</div>
                </div>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{timeAgo(moment.timestamp)}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
