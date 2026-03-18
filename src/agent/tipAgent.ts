/**
 * ─── Tip Agent ───────────────────────────────────────────────────────────────
 * Core agent loop: watches stream, detects moments, executes tips.
 * Imports wallet execution from services/wdk.ts only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { TipRule, TipEvent, AgentState, StreamMoment } from '../types';
import { sendTip, getWalletState } from '../services/wdk';
import {
  detectMomentLocally,
  generateMockSnapshot,
  buildMoment,
} from './momentDetector';

type AgentCallback = (event: {
  type: 'moment' | 'tip' | 'state';
  moment?: StreamMoment;
  tip?: TipEvent;
  state?: Partial<AgentState>;
}) => void;

// ── Creator wallet addresses (dev friend maps these to real WDK addresses) ────
const CREATOR_ADDRESSES: Record<string, string> = {
  default: '0x1234567890abcdef1234567890abcdef12345678',
};

export class TipAgent {
  private rule: TipRule;
  private state: AgentState;
  private callback: AgentCallback;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tick = 0;
  private previousChatRate = 15;
  private sessionTips: TipEvent[] = [];

  constructor(rule: TipRule, callback: AgentCallback) {
    this.rule = rule;
    this.callback = callback;
    this.state = {
      status: 'idle',
      currentCreator: null,
      spentThisStream: 0,
      tipsThisStream: 0,
      lastMoment: null,
    };
  }

  start(): void {
    if (this.state.status === 'watching') return;

    this.setState({ status: 'watching', currentCreator: this.rule.creatorName });

    // Agent loop — runs every 3 seconds
    this.intervalId = setInterval(() => this.loop(), 3000);
  }

  pause(): void {
    this.setState({ status: 'paused' });
  }

  resume(): void {
    if (this.state.status === 'paused') {
      this.setState({ status: 'watching' });
    }
  }

  stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.setState({ status: 'idle', currentCreator: null });
  }

  getState(): AgentState {
    return { ...this.state };
  }

  getSessionTips(): TipEvent[] {
    return [...this.sessionTips];
  }

  private async loop(): Promise<void> {
    if (this.state.status !== 'watching') return;

    this.tick++;

    // Get stream snapshot (mock for demo, real for prod)
    const snapshot = generateMockSnapshot(this.rule.creatorName, this.tick);

    // Detect moment
    const analysis = detectMomentLocally(snapshot, this.rule, this.previousChatRate);
    this.previousChatRate = snapshot.chatMessageRate;

    if (!analysis.detected || !analysis.momentType) return;

    // Build moment object
    const moment = buildMoment(analysis);

    // Check spending limit
    if (this.state.spentThisStream + this.rule.tipAmount > this.rule.maxPerStream) {
      this.callback({
        type: 'state',
        state: { lastMoment: `Limit reached — skipped ${analysis.description}` },
      });
      return;
    }

    // Check wallet balance
    const wallet = getWalletState();
    if (wallet.balances[this.rule.asset] < this.rule.tipAmount) {
      this.stop();
      this.callback({
        type: 'state',
        state: { status: 'idle', lastMoment: 'Insufficient balance — agent stopped' },
      });
      return;
    }

    // Emit moment detected
    moment.triggered = true;
    this.callback({ type: 'moment', moment });
    this.setState({ lastMoment: analysis.description });

    // Execute tip via WDK
    this.setState({ status: 'executing' });
    const creatorAddress = CREATOR_ADDRESSES[this.rule.creatorId] || CREATOR_ADDRESSES.default;

    const result = await sendTip({
      toAddress: creatorAddress,
      amount: this.rule.tipAmount,
      asset: this.rule.asset,
      memo: `MomentMint: ${analysis.description}`,
    });

    // Build tip event
    const tipEvent: TipEvent = {
      id: `tip-${Date.now()}`,
      timestamp: Date.now(),
      creatorId: this.rule.creatorId,
      creatorName: this.rule.creatorName,
      amount: this.rule.tipAmount,
      asset: this.rule.asset,
      momentType: analysis.momentType,
      momentDescription: analysis.description,
      txHash: result.txHash,
      status: result.success ? 'confirmed' : 'failed',
    };

    if (result.success) {
      this.sessionTips.push(tipEvent);
      this.setState({
        status: 'watching',
        spentThisStream: this.state.spentThisStream + this.rule.tipAmount,
        tipsThisStream: this.state.tipsThisStream + 1,
      });
    } else {
      this.setState({ status: 'watching' });
    }

    this.callback({ type: 'tip', tip: tipEvent });
  }

  private setState(partial: Partial<AgentState>): void {
    this.state = { ...this.state, ...partial };
    this.callback({ type: 'state', state: partial });
  }
}
