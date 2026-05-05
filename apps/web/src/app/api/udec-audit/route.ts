import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

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

    const screenshotKey = process.env.SCREENSHOTONE_API_KEY
    if (screenshotKey) {
      try {
        const shotUrl = new URL('https://api.screenshotone.com/take')
        shotUrl.searchParams.set('access_key', screenshotKey)
        shotUrl.searchParams.set('url', url)
        shotUrl.searchParams.set('format', 'jpg')
        shotUrl.searchParams.set('viewport_width', '1440')
        shotUrl.searchParams.set('viewport_height', '2200')
        shotUrl.searchParams.set('device_scale_factor', '1')
        shotUrl.searchParams.set('full_page', 'true')
        const shotRes = await fetch(shotUrl.toString(), { signal: AbortSignal.timeout(15_000) })
        if (shotRes.ok) {
          const bytes = await shotRes.arrayBuffer()
          const base64 = Buffer.from(bytes).toString('base64')
          siteContent += `\nScreenshot captured: yes\nScreenshot base64 (truncated): ${base64.slice(0, 6000)}`
        } else {
          siteContent += '\nScreenshot captured: no (provider error)'
        }
      } catch {
        siteContent += '\nScreenshot captured: no (request failed)'
      }
    } else {
      siteContent += '\nScreenshot captured: no (SCREENSHOTONE_API_KEY missing)'
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
