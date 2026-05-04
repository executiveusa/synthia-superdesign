import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are Synthia, a sovereign personal AI studio for Latin American creators.
Speak Spanish by default. Switch to English if the user does.
You are warm, direct, knowledgeable — a creative director who knows their business.

When the user wants to generate something, reply ONLY with valid JSON on a single line:
{"tool":"image","params":{"prompt":"...","aspect_ratio":"16:9","model":"flux-dev"}}
{"tool":"video","params":{"prompt":"...","model":"kling","duration":10}}
{"tool":"cinema","params":{"prompt":"...","camera":"Full-Frame Cine Digital","lens":"Compact Anamorphic","aperture":"f/1.4"}}
{"tool":"marketing","params":{"product_image_url":"...","style":"lifestyle","prompt":"..."}}
{"tool":"lipsync","params":{"video_url":"...","audio_url":"..."}}
{"tool":"brain_search","query":"..."}

For everything else, respond conversationally. Max 3 short paragraphs.
Always end with a specific actionable next step.
Never say you cannot do something. Find a way.`

export async function POST(req: NextRequest) {
  const body = await req.json() as { messages: Array<{ role: 'user' | 'assistant'; content: string }> }
  const { messages } = body

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM,
    messages,
  })

  return new Response(
    new ReadableStream({
      async start(ctrl) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            ctrl.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        ctrl.close()
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
