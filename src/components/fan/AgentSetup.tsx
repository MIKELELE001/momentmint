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
    label: { fontSize: 11, color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 12, fontWeight: 800 },
    section: { marginBottom: 24 },
  };

  return (
    <div style={{ background: '#F0EBE1', borderRadius: 16, padding: 24, boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 24 }}>⚙️ Configure Your Agent</div>

      {/* Creator selection */}
      <div style={S.section}>
        <div style={S.label}>Select Creator</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MOCK_CREATORS.map(c => {
            const isSel = selectedCreator.id === c.id;
            return (
            <div key={c.id} onClick={() => setSelectedCreator(c)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all .2s',
              background: '#F0EBE1',
              boxShadow: isSel ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff',
              border: isSel ? '1px solid rgba(107,70,193,0.2)' : '1px solid transparent'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.isLive ? '#EF4444' : '#D1D5DB', animation: c.isLive ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontSize: 14, color: isSel ? '#6B46C1' : '#4B5563', fontWeight: 700 }}>{c.name}</span>
              </div>
              {c.isLive && <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{c.viewers.toLocaleString()} viewers</span>}
            </div>
            );
          })}
        </div>
      </div>

      {/* Tip amount + asset */}
      <div style={{ ...S.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={S.label}>Tip Amount</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[1, 2, 5, 10].map(a => {
              const isSel = tipAmount === a;
              return (
              <button key={a} onClick={() => setTipAmount(a)} style={{
                padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: '#F0EBE1',
                color: isSel ? '#6B46C1' : '#6B7280',
                fontSize: 14, fontWeight: 800, fontFamily: "'Syne', sans-serif",
                boxShadow: isSel ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff',
              }}>${a}</button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={S.label}>Asset</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {ASSETS.map(a => {
              const isSel = asset === a;
              return (
              <button key={a} onClick={() => setAsset(a)} style={{
                padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: '#F0EBE1',
                color: isSel ? '#6B46C1' : '#6B7280',
                fontSize: 13, fontWeight: 800, fontFamily: "'Syne', sans-serif",
                boxShadow: isSel ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff',
              }}>{a}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Max per stream */}
      <div style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={S.label}>Max Per Stream</div>
          <span style={{ fontSize: 14, color: '#6B46C1', fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>${maxPerStream}</span>
        </div>
        <input type="range" min={5} max={100} step={5} value={maxPerStream}
          onChange={e => setMaxPerStream(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#6B46C1' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>$5</span>
          <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>$100</span>
        </div>
      </div>

      {/* Triggers */}
      <div style={S.section}>
        <div style={S.label}>Tip Triggers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TRIGGER_OPTIONS.map(t => {
            const isSel = triggers.includes(t.value);
            return (
            <div key={t.value} onClick={() => toggleTrigger(t.value)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              borderRadius: 12, cursor: 'pointer', transition: 'all .2s',
              background: '#F0EBE1',
              boxShadow: isSel ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff',
              border: isSel ? '1px solid rgba(107,70,193,0.2)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: 18 }}>{t.emoji}</span>
              <span style={{ fontSize: 12, color: isSel ? '#6B46C1' : '#4B5563', fontWeight: 700 }}>{t.label}</span>
            </div>
          )})}
        </div>
      </div>

      {/* Keywords */}
      {triggers.includes('keyword') && (
        <div style={S.section}>
          <div style={S.label}>Keywords (comma separated)</div>
          <input value={keywords} onChange={e => setKeywords(e.target.value)}
            placeholder="let's go, insane, clip it..."
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 12, border: 'none',
              background: '#F0EBE1', color: '#111827', fontSize: 13, fontWeight: 600,
              fontFamily: "'Syne', sans-serif", outline: 'none',
              boxShadow: 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff'
            }} />
        </div>
      )}

      {/* Start button */}
      <button onClick={handleStart} disabled={!isWalletConnected || triggers.length === 0} style={{
        width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
        background: !isWalletConnected ? '#E5E0d8' : 'linear-gradient(135deg, #8B5CF6, #6B46C1)',
        color: !isWalletConnected ? '#9CA3AF' : '#fff',
        fontSize: 14, fontWeight: 800, cursor: !isWalletConnected ? 'not-allowed' : 'pointer',
        fontFamily: "'Syne', sans-serif", letterSpacing: '2px', textTransform: 'uppercase',
        boxShadow: !isWalletConnected ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' : '4px 4px 16px rgba(107,70,193,0.4)',
        transition: 'all .25s',
      }}>
        {!isWalletConnected ? 'Connect Wallet First' : '🤖 Activate Agent'}
      </button>
    </div>
  );
}
