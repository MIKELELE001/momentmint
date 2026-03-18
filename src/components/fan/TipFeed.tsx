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
  confirmed: '#22d3a5',
  pending: '#F0B90B',
  failed: '#ef4444',
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
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 32, textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>👁️</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
          Agent is watching for moments...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: 20,
    }}>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
        Live Activity Feed
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
        {allEvents.map((event, i) => {
          if (event._type === 'tip') {
            const tip = event as TipEvent & { _type: 'tip' };
            return (
              <div key={tip.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 10, animation: i === 0 ? 'fadeUp .4s ease' : 'none',
                background: 'rgba(38,161,123,0.08)', border: '1px solid rgba(38,161,123,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{MOMENT_EMOJIS[tip.momentType] || '💸'}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      Tipped {tip.creatorName}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {tip.momentDescription}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#26A17B', fontFamily: "'DM Mono', monospace" }}>
                    +{tip.amount} {tip.asset}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 3 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLORS[tip.status] }} />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{timeAgo(tip.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          } else {
            const moment = event as StreamMoment & { _type: 'moment' };
            return (
              <div key={moment.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, opacity: 0.5 }}>{MOMENT_EMOJIS[moment.type] || '👁️'}</span>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{moment.description}</div>
                </div>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{timeAgo(moment.timestamp)}</span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
