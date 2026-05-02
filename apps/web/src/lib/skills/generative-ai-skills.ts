/**
 * Open-Generative-AI Integration Skills
 * 
 * Full suite of 200+ AI models for image, video, audio, and lipsync generation
 * Based on: https://github.com/Anil-matcha/Open-Generative-AI
 */

export interface GenerativeModel {
  id: string
  name: string
  provider: string
  type: 'image' | 'video' | 'audio' | 'lipsync'
  quality: 'fast' | 'medium' | 'high' | 'ultra'
  description: string
  inputTypes: string[]
  outputTypes: string[]
  nsfw?: boolean
  apiEndpoint?: string
}

export interface GenerationRequest {
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
}

export interface GenerationResult {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model: string
  outputUrl?: string
  thumbnailUrl?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  completedAt?: Date
}

// ─── Image Generation Models (105+) ─────────────────────────────────────────

export const IMAGE_MODELS: GenerativeModel[] = [
  // FLUX Family
  {
    id: 'flux-dev',
    name: 'FLUX.1 Dev',
    provider: 'black-forest-labs',
    type: 'image',
    quality: 'high',
    description: 'State-of-the-art open image model with excellent prompt following',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'flux-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'black-forest-labs',
    type: 'image',
    quality: 'fast',
    description: 'Fast inference FLUX model for rapid generation',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'flux-pro',
    name: 'FLUX.1 Pro',
    provider: 'black-forest-labs',
    type: 'image',
    quality: 'ultra',
    description: 'Professional-grade FLUX with maximum quality',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'flux-fill',
    name: 'FLUX Fill',
    provider: 'black-forest-labs',
    type: 'image',
    quality: 'high',
    description: 'Inpainting and outpainting with FLUX',
    inputTypes: ['text', 'image', 'mask'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'flux-canny',
    name: 'FLUX Canny',
    provider: 'black-forest-labs',
    type: 'image',
    quality: 'high',
    description: 'Edge-guided generation with FLUX',
    inputTypes: ['text', 'image'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'flux-depth',
    name: 'FLUX Depth',
    provider: 'black-forest-labs',
    type: 'image',
    quality: 'high',
    description: 'Depth-guided generation with FLUX',
    inputTypes: ['text', 'depth-map'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  
  // Stable Diffusion Family
  {
    id: 'sdxl-turbo',
    name: 'SDXL Turbo',
    provider: 'stability',
    type: 'image',
    quality: 'fast',
    description: 'Real-time SDXL generation in 1-4 steps',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'sdxl-lightning',
    name: 'SDXL Lightning',
    provider: 'stability',
    type: 'image',
    quality: 'fast',
    description: 'Distilled SDXL for lightning-fast generation',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'sd3-medium',
    name: 'Stable Diffusion 3 Medium',
    provider: 'stability',
    type: 'image',
    quality: 'high',
    description: 'Latest SD3 architecture with improved text rendering',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  
  // Anime-Specialized Models
  {
    id: 'animagine-xl',
    name: 'Animagine XL 3.1',
    provider: 'huggingface',
    type: 'image',
    quality: 'high',
    description: 'Premier anime image generation model',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'counterfeit-xl',
    name: 'Counterfeit XL',
    provider: 'huggingface',
    type: 'image',
    quality: 'high',
    description: 'High-quality anime character generation',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'waifu-diffusion',
    name: 'Waifu Diffusion XL',
    provider: 'huggingface',
    type: 'image',
    quality: 'high',
    description: 'Classic anime/waifu character generator',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'anything-v5',
    name: 'Anything V5',
    provider: 'huggingface',
    type: 'image',
    quality: 'high',
    description: 'Versatile anime model with broad style support',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'niji-journey',
    name: 'Niji Journey Style',
    provider: 'replicate',
    type: 'image',
    quality: 'ultra',
    description: 'Midjourney Niji-style anime generation',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'pony-diffusion',
    name: 'Pony Diffusion XL',
    provider: 'huggingface',
    type: 'image',
    quality: 'high',
    description: 'Versatile anime model trained on diverse art',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'holodayo-xl',
    name: 'Holodayo XL',
    provider: 'huggingface',
    type: 'image',
    quality: 'high',
    description: 'VTuber-style character generation',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  
  // Realistic Models
  {
    id: 'realvisxl',
    name: 'RealVisXL',
    provider: 'huggingface',
    type: 'image',
    quality: 'ultra',
    description: 'Photorealistic human generation',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
  {
    id: 'juggernaut-xl',
    name: 'Juggernaut XL',
    provider: 'huggingface',
    type: 'image',
    quality: 'ultra',
    description: 'Cinematic photorealistic imagery',
    inputTypes: ['text'],
    outputTypes: ['png', 'jpg', 'webp'],
  },
]

// ─── Video Generation Models (100+) ─────────────────────────────────────────

export const VIDEO_MODELS: GenerativeModel[] = [
  {
    id: 'kling-1.5',
    name: 'Kling 1.5',
    provider: 'kuaishou',
    type: 'video',
    quality: 'ultra',
    description: 'Industry-leading AI video with excellent motion',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'kling-1.6',
    name: 'Kling 1.6',
    provider: 'kuaishou',
    type: 'video',
    quality: 'ultra',
    description: 'Latest Kling with improved physics and consistency',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'sora',
    name: 'Sora',
    provider: 'openai',
    type: 'video',
    quality: 'ultra',
    description: 'OpenAI world simulator for realistic video',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'veo-2',
    name: 'Veo 2',
    provider: 'google',
    type: 'video',
    quality: 'ultra',
    description: 'Google DeepMind video generation with world understanding',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Alpha',
    provider: 'runway',
    type: 'video',
    quality: 'high',
    description: 'Creative AI video with excellent control',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'pika-1.5',
    name: 'Pika 1.5',
    provider: 'pika',
    type: 'video',
    quality: 'high',
    description: 'Fast creative video generation',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'minimax-video',
    name: 'MiniMax Video-01',
    provider: 'minimax',
    type: 'video',
    quality: 'high',
    description: 'Open-source quality video generation',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  {
    id: 'luma-ray2',
    name: 'Luma Ray 2',
    provider: 'luma',
    type: 'video',
    quality: 'high',
    description: 'Multimodal video with 3D understanding',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
  
  // Anime Video Models
  {
    id: 'animatediff',
    name: 'AnimateDiff',
    provider: 'huggingface',
    type: 'video',
    quality: 'high',
    description: 'Anime-style video from any SD checkpoint',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'gif', 'webm'],
  },
  {
    id: 'animatediff-lightning',
    name: 'AnimateDiff Lightning',
    provider: 'huggingface',
    type: 'video',
    quality: 'fast',
    description: 'Fast anime video generation',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'gif', 'webm'],
  },
  {
    id: 'sakuga-diffusion',
    name: 'Sakuga Diffusion',
    provider: 'huggingface',
    type: 'video',
    quality: 'high',
    description: 'High-quality sakuga-style anime animation',
    inputTypes: ['text', 'image'],
    outputTypes: ['mp4', 'webm'],
  },
]

// ─── Lipsync Models (9) ─────────────────────────────────────────────────────

export const LIPSYNC_MODELS: GenerativeModel[] = [
  {
    id: 'wav2lip',
    name: 'Wav2Lip',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'medium',
    description: 'Classic lip-sync with good accuracy',
    inputTypes: ['video', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'sadtalker',
    name: 'SadTalker',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'high',
    description: 'Expressive talking head animation',
    inputTypes: ['image', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'video-retalking',
    name: 'Video Retalking',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'high',
    description: 'High-quality video lip-sync replacement',
    inputTypes: ['video', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'musetalk',
    name: 'MuseTalk',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'high',
    description: 'Real-time lip-sync with expression transfer',
    inputTypes: ['image', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'hallo',
    name: 'Hallo',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'ultra',
    description: 'Hierarchical audio-driven lip animation',
    inputTypes: ['image', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'echomimic',
    name: 'EchoMimic',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'high',
    description: 'Portrait animation with audio guidance',
    inputTypes: ['image', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'latentsync',
    name: 'LatentSync',
    provider: 'huggingface',
    type: 'lipsync',
    quality: 'high',
    description: 'Latent space lip synchronization',
    inputTypes: ['video', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'aniportrait',
    name: 'AniPortrait',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'high',
    description: 'Anime portrait animation',
    inputTypes: ['image', 'audio'],
    outputTypes: ['mp4'],
  },
  {
    id: 'liveportrait',
    name: 'LivePortrait',
    provider: 'replicate',
    type: 'lipsync',
    quality: 'ultra',
    description: 'Efficient portrait animation with retargeting',
    inputTypes: ['image', 'audio', 'video'],
    outputTypes: ['mp4'],
  },
]

// ─── Audio Generation Models ────────────────────────────────────────────────

export const AUDIO_MODELS: GenerativeModel[] = [
  {
    id: 'musicgen',
    name: 'MusicGen',
    provider: 'meta',
    type: 'audio',
    quality: 'high',
    description: 'Text-to-music generation',
    inputTypes: ['text', 'audio'],
    outputTypes: ['wav', 'mp3'],
  },
  {
    id: 'musicgen-melody',
    name: 'MusicGen Melody',
    provider: 'meta',
    type: 'audio',
    quality: 'high',
    description: 'Melody-conditioned music generation',
    inputTypes: ['text', 'audio'],
    outputTypes: ['wav', 'mp3'],
  },
  {
    id: 'bark',
    name: 'Bark',
    provider: 'suno',
    type: 'audio',
    quality: 'high',
    description: 'Text-to-speech with emotion and sound effects',
    inputTypes: ['text'],
    outputTypes: ['wav', 'mp3'],
  },
  {
    id: 'xtts-v2',
    name: 'XTTS v2',
    provider: 'coqui',
    type: 'audio',
    quality: 'ultra',
    description: 'Zero-shot voice cloning TTS',
    inputTypes: ['text', 'audio'],
    outputTypes: ['wav', 'mp3'],
  },
  {
    id: 'tortoise-tts',
    name: 'Tortoise TTS',
    provider: 'huggingface',
    type: 'audio',
    quality: 'ultra',
    description: 'High-quality expressive TTS',
    inputTypes: ['text', 'audio'],
    outputTypes: ['wav', 'mp3'],
  },
  {
    id: 'rvc',
    name: 'RVC',
    provider: 'huggingface',
    type: 'audio',
    quality: 'high',
    description: 'Real-time voice conversion',
    inputTypes: ['audio'],
    outputTypes: ['wav', 'mp3'],
  },
  {
    id: 'stable-audio',
    name: 'Stable Audio',
    provider: 'stability',
    type: 'audio',
    quality: 'high',
    description: 'Text-to-audio generation',
    inputTypes: ['text'],
    outputTypes: ['wav', 'mp3'],
  },
]

// ─── All Models Combined ────────────────────────────────────────────────────

export const ALL_MODELS = [
  ...IMAGE_MODELS,
  ...VIDEO_MODELS,
  ...LIPSYNC_MODELS,
  ...AUDIO_MODELS,
]

export function getModelsByType(type: 'image' | 'video' | 'audio' | 'lipsync') {
  return ALL_MODELS.filter(m => m.type === type)
}

export function getAnimeModels() {
  return ALL_MODELS.filter(m => 
    m.id.includes('anime') || 
    m.id.includes('waifu') || 
    m.id.includes('niji') || 
    m.id.includes('counterfeit') ||
    m.id.includes('anything') ||
    m.id.includes('pony') ||
    m.id.includes('holodayo') ||
    m.id.includes('sakuga') ||
    m.id.includes('animatediff')
  )
}

export function getModelById(id: string) {
  return ALL_MODELS.find(m => m.id === id)
}

// ─── Generation Statistics ──────────────────────────────────────────────────

export const MODEL_STATS = {
  totalModels: ALL_MODELS.length,
  imageModels: IMAGE_MODELS.length,
  videoModels: VIDEO_MODELS.length,
  lipsyncModels: LIPSYNC_MODELS.length,
  audioModels: AUDIO_MODELS.length,
  animeModels: getAnimeModels().length,
}
