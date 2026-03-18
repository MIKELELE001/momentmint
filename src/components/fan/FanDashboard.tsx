import { useState, useEffect, useRef, useCallback } from 'react';
import type { TipRule, TipEvent, StreamMoment, WalletState, AgentState } from '../../types';
import { TipAgent } from '../../agent/tipAgent';
import WalletCard from './WalletCard';
import AgentSetup from './AgentSetup';
import TipFeed from './TipFeed';

interface SharedState {
  tips: TipEvent[];
  agentState: AgentState;
}

interface Props {
  shared: SharedState;
  onSharedUpdate: (partial: Partial<SharedState>) => void;
}

const DEFAULT_WALLET: WalletState = {
  address: null,
  balances: { USDT: 0, XAUt: 0, BTC: 0 },
  isConnected: false,
  isLoading: false,
};

const STATUS_CONFIG = {
  idle:      { label: 'IDLE',      color: 'rgba(255,255,255,0.3)',  bg: 'rgba(255,255,255,0.05)' },
  watching:  { label: 'WATCHING',  color: '#22d3a5',                bg: 'rgba(34,211,165,0.1)'   },
  paused:    { label: 'PAUSED',    color: '#F0B90B',                bg: 'rgba(240,185,11,0.1)'   },
  executing: { label: 'TIPPING',   color: '#26A17B',                bg: 'rgba(38,161,123,0.15)'  },
};

export default function FanDashboard({ shared, onSharedUpdate }: Props) {
  const [wallet, setWallet]         = useState<WalletState>(DEFAULT_WALLET);
  const [moments, setMoments]       = useState<StreamMoment[]>([]);
  const [activeRule, setActiveRule] = useState<TipRule | null>(null);
  const agentRef                    = useRef<TipAgent | null>(null);

  const handleAgentEvent = useCallback((event: Parameters<ConstructorParameters<typeof TipAgent>[1]>[0]) => {
    if (event.type === 'tip' && event.tip) {
      onSharedUpdate({ tips: [event.tip, ...shared.tips].slice(0, 50) });
    }
    if (event.type === 'moment' && event.moment) {
      setMoments(prev => [event.moment!, ...prev].slice(0, 50));
    }
    if (event.type === 'state' && event.state) {
      onSharedUpdate({ agentState: { ...shared.agentState, ...event.state } });
    }
  }, [shared, onSharedUpdate]);

  const handleStart = (rule: TipRule) => {
    setActiveRule(rule);
    setMoments([]);
    onSharedUpdate({ tips: [], agentState: { status: 'idle', currentCreator: null, spentThisStream: 0, tipsThisStream: 0, lastMoment: null } });
    const agent = new TipAgent(rule, handleAgentEvent);
    agentRef.current = agent;
    agent.start();
  };

  const handlePause = () => {
    if (shared.agentState.status === 'watching') agentRef.current?.pause();
    else if (shared.agentState.status === 'paused') agentRef.current?.resume();
  };

  const handleStop = () => {
    agentRef.current?.stop();
    setActiveRule(null);
    agentRef.current = null;
  };

  useEffect(() => () => { agentRef.current?.stop(); }, []);

  const agentState = shared.agentState;
  const tips = shared.tips;
  const status = STATUS_CONFIG[agentState.status];
  const totalSpent = tips.reduce((s, t) => s + t.amount, 0);
  const spendingPct = activeRule ? Math.min((agentState.spentThisStream / activeRule.maxPerStream) * 100, 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Agent status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderRadius: 14,
        background: status.bg, border: `1px solid ${status.color}30`, transition: 'all .4s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: status.color,
            animation: agentState.status === 'watching' ? 'pulse 1.5s infinite' : 'none' }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: status.color, letterSpacing: '2px' }}>{status.label}</div>
            {agentState.currentCreator && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Watching {agentState.currentCreator}</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {activeRule && (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'DM Mono', monospace" }}>{agentState.tipsThisStream}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>TIPS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#26A17B', fontFamily: "'DM Mono', monospace" }}>{agentState.spentThisStream.toFixed(2)}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>SPENT</div>
              </div>
            </>
          )}
          {agentState.status !== 'idle' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handlePause} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 11, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                {agentState.status === 'paused' ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button onClick={handleStop} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 11, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                ⏹ Stop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spending progress */}
      {activeRule && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase' }}>Stream Budget</span>
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: spendingPct > 80 ? '#ef4444' : '#26A17B', fontWeight: 700 }}>
              {agentState.spentThisStream.toFixed(2)} / {activeRule.maxPerStream} {activeRule.asset}
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, transition: 'width .5s ease', width: `${spendingPct}%`,
              background: spendingPct > 80 ? '#ef4444' : spendingPct > 50 ? '#F0B90B' : '#26A17B' }} />
          </div>
        </div>
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WalletCard wallet={wallet} onWalletChange={setWallet} />
          {agentState.status === 'idle' && (
            <AgentSetup onStart={handleStart} isWalletConnected={wallet.isConnected} />
          )}
        </div>
        <TipFeed tips={tips} moments={moments} />
      </div>

      {/* Summary stats */}
      {tips.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Tips Sent', value: tips.filter(t => t.status === 'confirmed').length, suffix: 'tips' },
            { label: 'Total Spent', value: `${totalSpent.toFixed(2)}`, suffix: activeRule?.asset || 'USDT' },
            { label: 'Success Rate', value: `${Math.round((tips.filter(t => t.status === 'confirmed').length / tips.length) * 100)}`, suffix: '%' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#26A17B', fontFamily: "'DM Mono', monospace" }}>
                {s.value} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
