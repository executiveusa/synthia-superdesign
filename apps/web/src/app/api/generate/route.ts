import { NextRequest, NextResponse } from 'next/server'
import { SynthiaMediaClient } from '@/lib/muapi-client'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limiter = checkRateLimit(`generate:${ip}`, 10, 60_000)
  if (!limiter.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const body = await req.json() as {
    tool: string
    params: Record<string, unknown>
    muapiKey?: string
  }
  const { tool, params, muapiKey } = body

  const key = muapiKey || process.env.MUAPI_DEFAULT_KEY || ''
  if (!key) {
    return NextResponse.json({ error: 'No muapi key configured' }, { status: 400 })
  }

  const client = new SynthiaMediaClient(key)
  let resultUrl: string

  try {
    switch (tool) {
      case 'image':
        resultUrl = await client.image(params as Parameters<typeof client.image>[0])
        break
      case 'video':
        resultUrl = await client.video(params as Parameters<typeof client.video>[0])
        break
      case 'cinema':
        resultUrl = await client.cinema(params as Parameters<typeof client.cinema>[0])
        break
      case 'marketing':
        resultUrl = await client.marketing(params as Parameters<typeof client.marketing>[0])
        break
      case 'lipsync':
        resultUrl = await client.lipSync(params.video_url as string, params.audio_url as string)
        break
      default:
        return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 })
    }

    return NextResponse.json({ result_url: resultUrl, tool })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Generation failed' }, { status: 500 })
  }
}
