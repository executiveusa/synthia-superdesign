import { NextRequest, NextResponse } from 'next/server'
import { 
  getModelById, 
  IMAGE_MODELS, 
  VIDEO_MODELS, 
  AUDIO_MODELS, 
  LIPSYNC_MODELS 
} from '@/lib/skills/generative-ai-skills'

export const runtime = 'edge'

interface GenerateRequest {
  model: string
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  steps?: number
  cfg?: number
  seed?: number
  style?: string
  referenceImage?: string
  mode?: 'standard' | 'anime'
}

interface GenerateResponse {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  model: string
  outputUrl?: string
  thumbnailUrl?: string
  eta?: number
  error?: string
}

// Provider API integrations would go here
// For now, this demonstrates the routing structure

async function generateWithFal(model: string, params: GenerateRequest): Promise<GenerateResponse> {
  const FAL_API_KEY = process.env.FAL_KEY
  if (!FAL_API_KEY) {
    return {
      id: `gen_${Date.now()}`,
      status: 'failed',
      model,
      error: 'FAL_KEY not configured. Add it to environment variables.',
    }
  }

  // Map our model IDs to fal endpoints
  const falEndpoints: Record<string, string> = {
    'flux-dev': 'fal-ai/flux/dev',
    'flux-schnell': 'fal-ai/flux/schnell',
    'flux-pro': 'fal-ai/flux-pro',
    'animatediff': 'fal-ai/animatediff-v2v',
    'animatediff-lightning': 'fal-ai/animatediff-sparsectrl-lcm',
  }

  const endpoint = falEndpoints[model]
  if (!endpoint) {
    return {
      id: `gen_${Date.now()}`,
      status: 'failed',
      model,
      error: `Model ${model} not yet integrated with fal.ai`,
    }
  }

  try {
    const response = await fetch(`https://fal.run/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        image_size: params.width && params.height 
          ? { width: params.width, height: params.height }
          : 'landscape_4_3',
        num_inference_steps: params.steps ?? 28,
        guidance_scale: params.cfg ?? 7.5,
        seed: params.seed,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return {
        id: `gen_${Date.now()}`,
        status: 'failed',
        model,
        error: `Fal API error: ${error}`,
      }
    }

    const result = await response.json()
    return {
      id: `gen_${Date.now()}`,
      status: 'completed',
      model,
      outputUrl: result.images?.[0]?.url ?? result.image?.url,
      thumbnailUrl: result.images?.[0]?.url ?? result.image?.url,
    }
  } catch (error) {
    return {
      id: `gen_${Date.now()}`,
      status: 'failed',
      model,
      error: String(error),
    }
  }
}

async function generateWithReplicate(model: string, params: GenerateRequest): Promise<GenerateResponse> {
  const REPLICATE_API_KEY = process.env.REPLICATE_API_TOKEN
  if (!REPLICATE_API_KEY) {
    return {
      id: `gen_${Date.now()}`,
      status: 'failed',
      model,
      error: 'REPLICATE_API_TOKEN not configured.',
    }
  }

  // Map our model IDs to replicate versions
  const replicateModels: Record<string, string> = {
    'sdxl-turbo': 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    'animagine-xl': 'cjwbw/animagine-xl-3.1:6a9b5e4e1b6a1b5e4e1b6a1b5e4e1b6a1b5e4e1b',
    'sadtalker': 'cjwbw/sadtalker:a519cc0cfebaaeade068b23899a5c4248d2f4ac0',
    'wav2lip': 'devxpy/wav2lip:8d65e3f4f4298520e079198b493c25adfc43c058',
  }

  const modelVersion = replicateModels[model]
  if (!modelVersion) {
    return {
      id: `gen_${Date.now()}`,
      status: 'failed',
      model,
      error: `Model ${model} not yet integrated with Replicate`,
    }
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: modelVersion.split(':')[1],
        input: {
          prompt: params.prompt,
          negative_prompt: params.negativePrompt,
          width: params.width ?? 1024,
          height: params.height ?? 1024,
          num_inference_steps: params.steps ?? 30,
          guidance_scale: params.cfg ?? 7.5,
          seed: params.seed ?? Math.floor(Math.random() * 1000000),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return {
        id: `gen_${Date.now()}`,
        status: 'failed',
        model,
        error: `Replicate API error: ${error}`,
      }
    }

    const result = await response.json()
    return {
      id: result.id,
      status: 'queued',
      model,
      eta: 30,
    }
  } catch (error) {
    return {
      id: `gen_${Date.now()}`,
      status: 'failed',
      model,
      error: String(error),
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as GenerateRequest
    const { model: modelId, prompt } = body

    if (!modelId || !prompt) {
      return NextResponse.json(
        { error: 'model and prompt are required' },
        { status: 400 }
      )
    }

    const model = getModelById(modelId)
    if (!model) {
      return NextResponse.json(
        { 
          error: `Unknown model: ${modelId}`,
          availableModels: {
            image: IMAGE_MODELS.map(m => m.id),
            video: VIDEO_MODELS.map(m => m.id),
            audio: AUDIO_MODELS.map(m => m.id),
            lipsync: LIPSYNC_MODELS.map(m => m.id),
          }
        },
        { status: 400 }
      )
    }

    // Route to appropriate provider
    let result: GenerateResponse

    switch (model.provider) {
      case 'black-forest-labs':
      case 'huggingface':
        result = await generateWithFal(modelId, body)
        break
      case 'replicate':
      case 'stability':
        result = await generateWithReplicate(modelId, body)
        break
      default:
        result = {
          id: `gen_${Date.now()}`,
          status: 'failed',
          model: modelId,
          error: `Provider ${model.provider} not yet integrated`,
        }
    }

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    models: {
      image: IMAGE_MODELS.length,
      video: VIDEO_MODELS.length,
      audio: AUDIO_MODELS.length,
      lipsync: LIPSYNC_MODELS.length,
      total: IMAGE_MODELS.length + VIDEO_MODELS.length + AUDIO_MODELS.length + LIPSYNC_MODELS.length,
    },
    animeModels: IMAGE_MODELS.filter(m => 
      m.id.includes('anime') || 
      m.id.includes('waifu') || 
      m.id.includes('niji')
    ).map(m => m.id),
  })
}
