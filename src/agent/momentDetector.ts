/**
 * ─── Moment Detector ─────────────────────────────────────────────────────────
 * Analyzes stream data and detects tippable moments.
 * Uses server-side Claude API (via /api/analyze) — no key in browser.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { StreamMoment, MomentType, TipRule } from '../types';

interface StreamSnapshot {
  chatMessageRate: number;    // messages per minute
  viewerCount: number;
  recentMessages: string[];
  streamDurationMinutes: number;
  creatorName: string;
}

interface MomentAnalysis {
  detected: boolean;
  momentType: MomentType | null;
  description: string;
  confidence: number;
}

// ── Rule-based detection (fast, no API needed) ────────────────────────────────
export const detectMomentLocally = (
  snapshot: StreamSnapshot,
  rule: TipRule,
  previousChatRate: number
): MomentAnalysis => {
  const { chatMessageRate, recentMessages, viewerCount } = snapshot;

  // Engagement spike detection
  if (
    rule.triggers.includes('engagement_spike') &&
    chatMessageRate > previousChatRate * 2.5 &&
    chatMessageRate > 20
  ) {
    return {
      detected: true,
      momentType: 'engagement_spike',
      description: `Chat exploded — ${Math.round(chatMessageRate)} msgs/min`,
      confidence: 0.85,
    };
  }

  // Keyword detection
  if (rule.triggers.includes('keyword') && rule.keywords.length > 0) {
    const lowerMessages = recentMessages.map(m => m.toLowerCase());
    const matched = rule.keywords.find(kw =>
      lowerMessages.some(m => m.includes(kw.toLowerCase()))
    );
    if (matched) {
      return {
        detected: true,
        momentType: 'keyword',
        description: `Keyword "${matched}" detected in chat`,
        confidence: 0.9,
      };
    }
  }

  // Milestone detection (viewer count thresholds)
  if (rule.triggers.includes('milestone')) {
    const milestones = [100, 500, 1000, 5000, 10000, 50000];
    const hit = milestones.find(m =>
      viewerCount >= m && viewerCount < m * 1.05
    );
    if (hit) {
      return {
        detected: true,
        momentType: 'milestone',
        description: `${hit.toLocaleString()} viewers milestone!`,
        confidence: 0.95,
      };
    }
  }

  return { detected: false, momentType: null, description: '', confidence: 0 };
};

// ── AI-powered detection (via server-side API) ────────────────────────────────
export const detectMomentWithAI = async (
  snapshot: StreamSnapshot,
  rule: TipRule
): Promise<MomentAnalysis> => {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        snapshot,
        triggers: rule.triggers,
        keywords: rule.keywords,
      }),
    });

    if (!res.ok) throw new Error('AI analysis failed');
    return await res.json();
  } catch {
    // Fallback to local detection if AI unavailable
    return detectMomentLocally(snapshot, rule, snapshot.chatMessageRate * 0.5);
  }
};

// ── Generate mock stream snapshot (for demo) ──────────────────────────────────
export const generateMockSnapshot = (
  creatorName: string,
  tick: number
): StreamSnapshot => {
  const baseRate = 15;
  const spike = tick % 8 === 0; // spike every 8 ticks

  return {
    chatMessageRate: spike ? baseRate * 3.2 : baseRate + Math.random() * 8,
    viewerCount: 1200 + Math.floor(Math.random() * 200),
    recentMessages: spike
      ? ["LET'S GOOO!!!", 'insane clip', 'clip it clip it', 'W streamer', '🔥🔥🔥', 'POGGERS']
      : ['nice', 'lol', 'good play', 'hi chat', '👍'],
    streamDurationMinutes: tick * 0.5,
    creatorName,
  };
};

// ── Build a StreamMoment from analysis ───────────────────────────────────────
export const buildMoment = (analysis: MomentAnalysis): StreamMoment => ({
  id: `m-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  timestamp: Date.now(),
  type: analysis.momentType!,
  description: analysis.description,
  confidence: analysis.confidence,
  triggered: false,
});
