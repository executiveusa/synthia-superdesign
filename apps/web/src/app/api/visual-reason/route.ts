import { NextRequest } from 'next/server'
import { runVisualReasoningChain } from '@/lib/visual-reasoning'
import type { VisualReasoningStep } from '@/lib/visual-reasoning'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limiter = checkRateLimit(`visual-reason:${ip}`, 8, 60_000)
  if (!limiter.allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 })
  }

  const { prompt, muapiKey } = await req.json() as { prompt: string; muapiKey: string }
  const encoder = new TextEncoder()

  return new Response(
    new ReadableStream({
      async start(ctrl) {
        const send = (data: unknown) =>
          ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

        try {
          const chain = await runVisualReasoningChain({
            prompt,
            muapiKey,
            anthropicKey: process.env.ANTHROPIC_API_KEY!,
            onStep: (step: VisualReasoningStep) => send({ type: 'step', step }),
          })
          send({ type: 'complete', chain })
        } catch (err) {
          send({ type: 'error', message: String(err) })
        }
        ctrl.close()
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } }
  )
}
