import { useState } from 'react';
import FanDashboard from './components/fan/FanDashboard';
import CreatorDashboard from './components/creator/CreatorDashboard';
import type { TipEvent, AgentState } from './types';

type View = 'fan' | 'creator';

interface SharedState {
  tips: TipEvent[];
  agentState: AgentState;
}

const DEFAULT_AGENT_STATE: AgentState = {
  status: 'idle',
  currentCreator: null,
  spentThisStream: 0,
  tipsThisStream: 0,
  lastMoment: null,
};

export default function App() {
  const [view, setView]     = useState<View>('fan');
  const [shared, setShared] = useState<SharedState>({
    tips: [],
    agentState: DEFAULT_AGENT_STATE,
  });

  const updateShared = (partial: Partial<SharedState>) => {
    setShared(prev => ({ ...prev, ...partial }));
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#060a10', color: '#e8eaf0',
      fontFamily: "'Syne', sans-serif", position: 'relative', overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(38,161,123,0.3); border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #26A17B; cursor: pointer; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(rgba(38,161,123,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(38,161,123,0.025) 1px,transparent 1px)`,
        backgroundSize: '40px 40px' }} />
      <div style={{ position: 'fixed', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(38,161,123,0.07) 0%,transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -200, left: -200, width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(240,185,11,0.04) 0%,transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #26A17B, #1a7a5e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 0 24px rgba(38,161,123,0.4)' }}>⚡</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>MomentMint</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Autonomous Tipping · Tether WDK · OpenClaw
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {shared.agentState.status !== 'idle' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px',
                borderRadius: 20, background: 'rgba(38,161,123,0.1)', border: '1px solid rgba(38,161,123,0.3)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#26A17B', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 10, color: '#26A17B', fontWeight: 700, letterSpacing: '1px' }}>
                  AGENT {shared.agentState.status.toUpperCase()}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
              {(['fan', 'creator'] as View[]).map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
                  fontFamily: "'Syne', sans-serif", transition: 'all .2s',
                  background: view === v ? 'rgba(38,161,123,0.18)' : 'transparent',
                  color: view === v ? '#26A17B' : 'rgba(255,255,255,0.4)',
                }}>
                  {v === 'fan' ? '🎮 Fan View' : '🎬 Creator View'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Both views mounted — only one visible. This keeps agent alive on tab switch */}
        <div style={{ display: view === 'fan' ? 'block' : 'none' }}>
          <FanDashboard shared={shared} onSharedUpdate={updateShared} />
        </div>
        <div style={{ display: view === 'creator' ? 'block' : 'none' }}>
          <CreatorDashboard tips={shared.tips} />
        </div>

        <div style={{ textAlign: 'center', padding: '28px 0 8px', fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '2px' }}>
          MOMENTMINT · TETHER WDK · OPENCLAW · RUMBLE · #HackathonGalactica
        </div>
      </div>
    </div>
  );
}
