/**
 * ─── Server-Side AI Analysis ─────────────────────────────────────────────────
 * Claude API key lives HERE only — never in the browser bundle.
 * Called from agent/momentDetector.ts via fetch('/api/analyze')
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI not configured' }), { status: 500 });
  }

  try {
    const body = await req.json();
    const { snapshot, triggers, keywords } = body;

    const prompt = `You are a livestream moment detector for MomentMint, an autonomous tipping agent.

Analyze this stream snapshot and determine if it represents a significant tippable moment:

Stream Data:
- Creator: ${snapshot.creatorName}
- Chat rate: ${snapshot.chatMessageRate.toFixed(1)} messages/minute
- Viewers: ${snapshot.viewerCount}
- Recent chat: ${snapshot.recentMessages.slice(0, 6).join(' | ')}
- Stream duration: ${snapshot.streamDurationMinutes} minutes

Fan's trigger rules: ${triggers.join(', ')}
Keywords to watch for: ${keywords.join(', ') || 'none'}

Respond ONLY with valid JSON in this exact format:
{
  "detected": true or false,
  "momentType": "engagement_spike" | "milestone" | "keyword" | "celebration" | "donation_goal" | null,
  "description": "brief description of what happened",
  "confidence": 0.0 to 1.0
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';

    // Safe JSON parse
    const clean = text.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(clean);

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        detected: false,
        momentType: null,
        description: '',
        confidence: 0,
      }),
      { status: 200 }
    );
  }
}
