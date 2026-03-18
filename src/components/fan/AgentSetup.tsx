import { useState } from 'react';
import type { TipRule, Asset, MomentType } from '../../types';

interface Props {
  onStart: (rule: TipRule) => void;
  isWalletConnected: boolean;
}

const MOCK_CREATORS = [
  { id: 'c1', name: 'CryptoKing_Live', isLive: true, viewers: 4200 },
  { id: 'c2', name: 'TechWithSarah', isLive: true, viewers: 1800 },
  { id: 'c3', name: 'GameMasterX', isLive: true, viewers: 890 },
  { id: 'c4', name: 'DeFiDaily', isLive: false, viewers: 0 },
];

const TRIGGER_OPTIONS: { value: MomentType; label: string; emoji: string }[] = [
  { value: 'engagement_spike', label: 'Chat Explosion', emoji: '⚡' },
  { value: 'milestone', label: 'Viewer Milestone', emoji: '🏆' },
  { value: 'keyword', label: 'Keyword Trigger', emoji: '🎯' },
  { value: 'celebration', label: 'Celebration Moment', emoji: '🎉' },
];

const ASSETS: Asset[] = ['USDT', 'XAUt', 'BTC'];

export default function AgentSetup({ onStart, isWalletConnected }: Props) {
  const [selectedCreator, setSelectedCreator] = useState(MOCK_CREATORS[0]);
  const [tipAmount, setTipAmount] = useState(2);
  const [maxPerStream, setMaxPerStream] = useState(20);
  const [asset, setAsset] = useState<Asset>('USDT');
  const [triggers, setTriggers] = useState<MomentType[]>(['engagement_spike']);
  const [keywords, setKeywords] = useState("let's go, insane, clip it");

  const toggleTrigger = (t: MomentType) => {
    setTriggers(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleStart = () => {
    if (!isWalletConnected || triggers.length === 0) return;
    const rule: TipRule = {
      id: `rule-${Date.now()}`,
      creatorId: selectedCreator.id,
      creatorName: selectedCreator.name,
      tipAmount,
      asset,
      maxPerStream,
      triggers,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      isActive: true,
    };
    onStart(rule);
  };

  const S = {
    label: { fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: 8 },
    section: { marginBottom: 20 },
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 22 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>⚙️ Configure Your Agent</div>

      {/* Creator selection */}
      <div style={S.section}>
        <div style={S.label}>Select Creator</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MOCK_CREATORS.map(c => (
            <div key={c.id} onClick={() => setSelectedCreator(c)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: 10, cursor: 'pointer', transition: 'all .15s',
              background: selectedCreator.id === c.id ? 'rgba(38,161,123,0.12)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selectedCreator.id === c.id ? 'rgba(38,161,123,0.35)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.isLive ? '#ef4444' : 'rgba(255,255,255,0.2)', animation: c.isLive ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>{c.name}</span>
              </div>
              {c.isLive && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{c.viewers.toLocaleString()} viewers</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tip amount + asset */}
      <div style={{ ...S.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={S.label}>Tip Amount</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 5, 10].map(a => (
              <button key={a} onClick={() => setTipAmount(a)} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tipAmount === a ? 'rgba(38,161,123,0.2)' : 'rgba(255,255,255,0.04)',
                color: tipAmount === a ? '#26A17B' : 'rgba(255,255,255,0.5)',
                fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif",
              }}>${a}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={S.label}>Asset</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {ASSETS.map(a => (
              <button key={a} onClick={() => setAsset(a)} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: asset === a ? 'rgba(38,161,123,0.2)' : 'rgba(255,255,255,0.04)',
                color: asset === a ? '#26A17B' : 'rgba(255,255,255,0.5)',
                fontSize: 10, fontWeight: 700, fontFamily: "'Syne', sans-serif",
              }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Max per stream */}
      <div style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={S.label}>Max Per Stream</div>
          <span style={{ fontSize: 12, color: '#26A17B', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>${maxPerStream}</span>
        </div>
        <input type="range" min={5} max={100} step={5} value={maxPerStream}
          onChange={e => setMaxPerStream(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#26A17B' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>$5</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>$100</span>
        </div>
      </div>

      {/* Triggers */}
      <div style={S.section}>
        <div style={S.label}>Tip Triggers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {TRIGGER_OPTIONS.map(t => (
            <div key={t.value} onClick={() => toggleTrigger(t.value)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              borderRadius: 10, cursor: 'pointer', transition: 'all .15s',
              background: triggers.includes(t.value) ? 'rgba(38,161,123,0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${triggers.includes(t.value) ? 'rgba(38,161,123,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: 16 }}>{t.emoji}</span>
              <span style={{ fontSize: 11, color: triggers.includes(t.value) ? '#26A17B' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      {triggers.includes('keyword') && (
        <div style={S.section}>
          <div style={S.label}>Keywords (comma separated)</div>
          <input value={keywords} onChange={e => setKeywords(e.target.value)}
            placeholder="let's go, insane, clip it..."
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 12,
              fontFamily: "'Syne', sans-serif", outline: 'none',
            }} />
        </div>
      )}

      {/* Start button */}
      <button onClick={handleStart} disabled={!isWalletConnected || triggers.length === 0} style={{
        width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
        background: !isWalletConnected ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #26A17B, #1a7a5e)',
        color: !isWalletConnected ? 'rgba(255,255,255,0.25)' : '#fff',
        fontSize: 12, fontWeight: 800, cursor: !isWalletConnected ? 'not-allowed' : 'pointer',
        fontFamily: "'Syne', sans-serif", letterSpacing: '2px', textTransform: 'uppercase',
        boxShadow: !isWalletConnected ? 'none' : '0 4px 24px rgba(38,161,123,0.3)',
        transition: 'all .25s',
      }}>
        {!isWalletConnected ? 'Connect Wallet First' : '🤖 Activate Agent'}
      </button>
    </div>
  );
}
