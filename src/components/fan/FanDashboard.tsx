import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
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
  idle:      { label: 'IDLE',      color: '#6B7280', shadow: 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' },
  watching:  { label: 'WATCHING',  color: '#8B5CF6', shadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' },
  paused:    { label: 'PAUSED',    color: '#F59E0B', shadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' },
  executing: { label: 'TIPPING',   color: '#10B981', shadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' },
};

export default memo(function FanDashboard({ shared, onSharedUpdate }: Props) {
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
  const totalSpent = agentState.spentThisStream;
  const spendingPct = useMemo(() => activeRule ? Math.min((agentState.spentThisStream / activeRule.maxPerStream) * 100, 100) : 0, [activeRule, agentState.spentThisStream]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Agent status bar - Glass + Neumorphism */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderRadius: 16,
        background: '#F0EBE1', 
        boxShadow: status.shadow,
        transition: 'all .4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: status.color,
            animation: agentState.status === 'watching' ? 'pulse 1.5s infinite' : 'none',
            boxShadow: `0 0 10px ${status.color}` }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: status.color, letterSpacing: '2px' }}>{status.label}</div>
            {agentState.currentCreator && (
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: 600 }}>Watching {agentState.currentCreator}</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {activeRule && (
            <>
              <div style={{ textAlign: 'center', padding: '0 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', fontFamily: "'DM Mono', monospace" }}>{agentState.tipsThisStream}</div>
                <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '1px', fontWeight: 600 }}>TIPS</div>
              </div>
              <div style={{ textAlign: 'center', padding: '0 12px', borderLeft: '1px solid #d1cabe' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#6B46C1', fontFamily: "'DM Mono', monospace" }}>{agentState.spentThisStream.toFixed(2)}</div>
                <div style={{ fontSize: 9, color: '#9CA3AF', letterSpacing: '1px', fontWeight: 600 }}>SPENT</div>
              </div>
            </>
          )}
          {agentState.status !== 'idle' && (
            <div style={{ display: 'flex', gap: 10, marginLeft: 10 }}>
              <button onClick={handlePause} style={{ 
                padding: '8px 16px', borderRadius: 10, border: 'none', background: '#F0EBE1', 
                color: '#4B5563', fontSize: 12, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700,
                boxShadow: '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff'
              }}>
                {agentState.status === 'paused' ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button onClick={handleStop} style={{ 
                padding: '8px 16px', borderRadius: 10, border: 'none', background: '#F0EBE1', 
                color: '#EF4444', fontSize: 12, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700,
                boxShadow: '4px 4px 8px #d1cabe, -4px -4px 8px #ffffff'
              }}>
                ⏹ Stop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spending progress */}
      {activeRule && (
        <div style={{ background: '#F0EBE1', borderRadius: 16, padding: '16px 20px', boxShadow: 'inset 4px 4px 8px #d1cabe, inset -4px -4px 8px #ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Stream Budget</span>
            <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: spendingPct > 80 ? '#EF4444' : '#6B46C1', fontWeight: 800 }}>
              {agentState.spentThisStream.toFixed(2)} / {activeRule.maxPerStream} {activeRule.asset}
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ height: '100%', borderRadius: 4, transition: 'width .5s ease', width: `${spendingPct}%`,
              background: spendingPct > 80 ? '#EF4444' : spendingPct > 50 ? '#F59E0B' : 'linear-gradient(90deg, #8B5CF6, #6B46C1)' }} />
          </div>
        </div>
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 2fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <WalletCard wallet={wallet} onWalletChange={setWallet} />
          {agentState.status === 'idle' && (
            <AgentSetup onStart={handleStart} isWalletConnected={wallet.isConnected} />
          )}
        </div>
        <TipFeed tips={tips} moments={moments} />
      </div>

      {/* Summary stats */}
      {tips.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { label: 'Total Tips Sent', value: tips.filter(t => t.status === 'confirmed').length, suffix: 'tips', color: '#111827' },
            { label: 'Total Spent', value: `${totalSpent.toFixed(2)}`, suffix: activeRule?.asset || 'USDT', color: '#6B46C1' },
            { label: 'Success Rate', value: `${Math.round((tips.filter(t => t.status === 'confirmed').length / tips.length) * 100)}`, suffix: '%', color: '#10B981' },
          ].map(s => (
            <div key={s.label} style={{ background: '#F0EBE1', borderRadius: 16, padding: '20px 24px', boxShadow: '6px 6px 12px #d1cabe, -6px -6px 12px #ffffff' }}>
              <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>
                {s.value} <span style={{ fontSize: 14, color: '#9CA3AF' }}>{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
