import { useState, useCallback } from 'react';
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

  const updateShared = useCallback((partial: Partial<SharedState>) => {
    setShared(prev => ({ ...prev, ...partial }));
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#F0EBE1', color: '#111827',
      fontFamily: "'Syne', sans-serif", position: 'relative', overflowX: 'hidden',
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.5); border-radius: 4px; }
        input[type=range] { -webkit-appearance: none; height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; outline: none; box-shadow: inset 1px 1px 3px rgba(0,0,0,0.1); }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #6B46C1; cursor: pointer; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); }
      `}</style>

      {/* Web3 Glassmorphic Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.5,
        backgroundImage: `linear-gradient(rgba(107,70,193,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(107,70,193,0.03) 1px,transparent 1px)`,
        backgroundSize: '40px 40px' }} />
      <div style={{ position: 'fixed', top: -150, right: -100, width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -150, left: -100, width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Udemy-style Nav Header */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(240, 235, 225, 0.75)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '16px 40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #8B5CF6, #6B46C1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '4px 4px 10px rgba(107,70,193,0.3), -2px -2px 6px rgba(255,255,255,0.8)' }}>⚡</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: '#111827' }}>MomentMint</div>
            <div style={{ fontSize: 9, color: '#6B7280', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Autonomous Tipping · Web3
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {shared.agentState.status !== 'idle' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
              borderRadius: 20, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.7), 2px 2px 8px rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: 11, color: '#047857', fontWeight: 800, letterSpacing: '1px' }}>
                AGENT {shared.agentState.status.toUpperCase()}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            {(['fan', 'creator'] as View[]).map(v => {
              const isActive = view === v;
              return (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.5px',
                  fontFamily: "'Syne', sans-serif", transition: 'all .3s',
                  background: isActive ? '#F0EBE1' : '#F0EBE1',
                  color: isActive ? '#6B46C1' : '#6B7280',
                  boxShadow: isActive 
                    ? 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff'
                    : '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff',
                }}>
                  {v === 'fan' ? '🎮 Fan View' : '🎬 Creator View'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* Both views mounted — only one visible. This keeps agent alive on tab switch */}
        <div style={{ display: view === 'fan' ? 'block' : 'none' }}>
          <FanDashboard shared={shared} onSharedUpdate={updateShared} />
        </div>
        <div style={{ display: view === 'creator' ? 'block' : 'none' }}>
          <CreatorDashboard tips={shared.tips} />
        </div>

        <div style={{ textAlign: 'center', padding: '60px 0 20px', fontSize: 11, color: '#9CA3AF', letterSpacing: '2px', fontWeight: 600 }}>
          MOMENTMINT · WEB3 TIPPING EXPERT
        </div>
      </div>
    </div>
  );
}
