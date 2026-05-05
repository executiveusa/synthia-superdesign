import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

const AXES = [
  'Typography', 'Color Harmony', 'Visual Hierarchy', 'Spacing',
  'Mobile Responsiveness', 'Load Performance', 'CTA Clarity', 'Trust Signals',
  'Navigation', 'Brand Consistency', 'Imagery Quality', 'Copy Clarity',
  'Conversion Optimization', 'Accessibility',
]

const AUDIT_PROMPT = `You are a UDEC design auditor for Synthia™. Score this website on these 14 axes (0-10 each):
${AXES.join(', ')}.

Return JSON only:
{
  "scores": {"Typography": 7, "Color Harmony": 8, ...},
  "overall": 7.5,
  "top_issues": ["issue 1", "issue 2", "issue 3"],
  "quick_wins": ["quick win 1", "quick win 2", "quick win 3"]
}`

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anon'
  const rl = rateLimit(`${ip}:udec_audit`, RATE_LIMITS.udec_audit.maxRequests, RATE_LIMITS.udec_audit.windowMs)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', message: 'Demasiadas solicitudes. Intenta en un momento.', retry_after_ms: rl.resetAt - Date.now() },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rl.resetAt) } }
    )
  }

  const { url } = await req.json() as { url: string }

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  // In production: capture screenshot via Puppeteer or screenshot API
  // For now: do a text-based analysis via fetch
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    let siteContent = ''
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
      const html = await r.text()
      const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || ''
      const desc = html.match(/name="description" content="([^"]+)"/i)?.[1] || ''
      const hasMobile = html.includes('viewport')
      const hasSSL = url.startsWith('https')
      siteContent = `URL: ${url}\nTitle: ${title}\nMeta description: ${desc || 'missing'}\nMobile viewport: ${hasMobile}\nHTTPS: ${hasSSL}\nPage size estimate: ${(html.length / 1024).toFixed(0)}KB`
    } catch {
      siteContent = `URL: ${url}\nCould not fetch page content.`
    }

    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `${AUDIT_PROMPT}\n\nSite info:\n${siteContent}`,
      }],
    })

    const text = res.content[0].type === 'text' ? res.content[0].text : '{}'
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json({ url, ...parsed })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Audit failed' }, { status: 500 })
  }
}
