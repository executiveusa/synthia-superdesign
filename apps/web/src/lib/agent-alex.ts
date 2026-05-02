/**
 * AGENT ALEX — Master Orchestrator (Hermes-class)
 * 
 * Built on NousResearch Hermes Agent architecture
 * Full sub-agent spawning capabilities with Claude Code-style parallel workstreams
 * Integrated with Open-Generative-AI for 200+ models
 */

import { AGENTS, SKILLS } from './studio-config'

// ─── Agent Alex Core Definition ─────────────────────────────────────────────

export interface SubAgent {
  id: string
  name: string
  parentId: string
  status: 'spawning' | 'active' | 'idle' | 'completed' | 'error'
  task: string
  spawnedAt: Date
  completedAt?: Date
  output?: string
  model: string
}

export interface AgentAlexState {
  isActive: boolean
  currentTask: string | null
  subAgents: SubAgent[]
  capabilities: string[]
  activeSkills: string[]
  mode: 'standard' | 'anime' | 'generative' | 'upwork'
}

export const AGENT_ALEX = {
  id: 'alex',
  name: 'Agent Alex',
  class: 'Hermes-class',
  role: 'Master Orchestrator',
  scope: 'Commands all 12 studio agents. Spawns sub-agents for parallel workstreams. Full generative AI capabilities.',
  inputs: 'Any task, brief, or creative request',
  outputs: 'Orchestrated multi-agent workflows, spawned sub-agents, generative content',
  workspace: 'studio/alex/',
  color: '#ff6b35', // Vibrant orange for Alex
  avatar: '/agents/alex-avatar.png',
  capabilities: [
    'Multi-agent orchestration',
    'Sub-agent spawning (Claude Code-style)',
    'Parallel workstream management',
    'Open-Generative-AI integration (200+ models)',
    'Anime mode generation',
    'Upwork-ready task execution',
    'Full generative suite (text, image, video, audio)',
  ],
}

// ─── Sub-Agents Under Alex ──────────────────────────────────────────────────

export const ALEX_SUB_AGENTS: SubAgent[] = []

export function createSubAgent(
  name: string,
  task: string,
  model: string = 'claude-opus-4-7'
): SubAgent {
  return {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    parentId: 'alex',
    status: 'spawning',
    task,
    spawnedAt: new Date(),
    model,
  }
}

// ─── Open-Generative-AI Integration ─────────────────────────────────────────

export const GENERATIVE_AI_MODELS = {
  // Image Generation (105+ models)
  image: {
    flux: [
      { id: 'flux-dev', name: 'FLUX.1 Dev', provider: 'black-forest-labs', quality: 'high' },
      { id: 'flux-schnell', name: 'FLUX.1 Schnell', provider: 'black-forest-labs', quality: 'fast' },
      { id: 'flux-pro', name: 'FLUX.1 Pro', provider: 'black-forest-labs', quality: 'ultra' },
    ],
    midjourney: [
      { id: 'midjourney-v6', name: 'Midjourney v6 Style', provider: 'replicate', quality: 'ultra' },
    ],
    sdxl: [
      { id: 'sdxl-turbo', name: 'SDXL Turbo', provider: 'stability', quality: 'fast' },
      { id: 'sdxl-lightning', name: 'SDXL Lightning', provider: 'stability', quality: 'fast' },
    ],
    anime: [
      { id: 'animagine-xl', name: 'Animagine XL 3.1', provider: 'huggingface', quality: 'high' },
      { id: 'counterfeit-xl', name: 'Counterfeit XL', provider: 'huggingface', quality: 'high' },
      { id: 'waifu-diffusion', name: 'Waifu Diffusion', provider: 'huggingface', quality: 'medium' },
      { id: 'anything-v5', name: 'Anything V5', provider: 'huggingface', quality: 'high' },
      { id: 'niji-journey', name: 'Niji Journey Style', provider: 'replicate', quality: 'ultra' },
    ],
  },
  // Video Generation (100+ models)
  video: {
    general: [
      { id: 'kling-1.5', name: 'Kling 1.5', provider: 'kuaishou', quality: 'ultra' },
      { id: 'sora', name: 'Sora', provider: 'openai', quality: 'ultra' },
      { id: 'veo-2', name: 'Veo 2', provider: 'google', quality: 'ultra' },
      { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', provider: 'runway', quality: 'high' },
      { id: 'pika-1.5', name: 'Pika 1.5', provider: 'pika', quality: 'high' },
    ],
    anime: [
      { id: 'animatediff', name: 'AnimateDiff', provider: 'huggingface', quality: 'high' },
      { id: 'sakuga-diffusion', name: 'Sakuga Diffusion', provider: 'huggingface', quality: 'high' },
    ],
  },
  // Lipsync (9 models)
  lipsync: [
    { id: 'wav2lip', name: 'Wav2Lip', provider: 'replicate', quality: 'medium' },
    { id: 'sadtalker', name: 'SadTalker', provider: 'replicate', quality: 'high' },
    { id: 'video-retalking', name: 'Video Retalking', provider: 'replicate', quality: 'high' },
  ],
  // Audio Generation
  audio: [
    { id: 'musicgen', name: 'MusicGen', provider: 'meta', quality: 'high' },
    { id: 'bark', name: 'Bark TTS', provider: 'suno', quality: 'high' },
    { id: 'xtts-v2', name: 'XTTS v2', provider: 'coqui', quality: 'ultra' },
  ],
}

// ─── Anime Mode Capabilities ────────────────────────────────────────────────

export const ANIME_MODE = {
  id: 'anime-mode',
  name: 'Anime Mode',
  description: 'Full anime creation pipeline with character design, manga panels, sakuga animation, and VTuber assets',
  
  generators: {
    character: {
      name: 'Character Generator',
      description: 'Generate anime characters with consistent style across poses',
      models: ['animagine-xl', 'niji-journey', 'counterfeit-xl'],
      outputTypes: ['character-sheet', 'turnaround', 'expression-sheet', 'pose-library'],
    },
    manga: {
      name: 'Manga Panel Generator',
      description: 'Create manga pages with proper panel layouts and speech bubbles',
      models: ['manga-xl', 'animagine-xl'],
      outputTypes: ['single-panel', 'page-layout', '4-koma', 'double-spread'],
    },
    sakuga: {
      name: 'Sakuga Animation',
      description: 'High-quality anime animation sequences',
      models: ['animatediff', 'sakuga-diffusion'],
      outputTypes: ['action-sequence', 'emotional-beat', 'transformation', 'effects'],
    },
    vtuber: {
      name: 'VTuber Asset Generator',
      description: 'Live2D-ready VTuber character assets',
      models: ['animagine-xl', 'live2d-gen'],
      outputTypes: ['live2d-layers', 'expressions', 'idle-animation', 'talking-animation'],
    },
    background: {
      name: 'Anime Background Generator',
      description: 'Detailed anime-style backgrounds and environments',
      models: ['animagine-xl', 'counterfeit-xl'],
      outputTypes: ['exterior', 'interior', 'fantasy', 'urban', 'nature'],
    },
  },
  
  styles: [
    { id: 'shonen', name: 'Shonen', description: 'Action-oriented, bold lines, dynamic poses' },
    { id: 'shojo', name: 'Shojo', description: 'Soft, flowing, romantic aesthetic' },
    { id: 'seinen', name: 'Seinen', description: 'Mature, detailed, realistic proportions' },
    { id: 'chibi', name: 'Chibi', description: 'Cute, super-deformed, expressive' },
    { id: 'mecha', name: 'Mecha', description: 'Mechanical, detailed robots and technology' },
    { id: 'isekai', name: 'Isekai', description: 'Fantasy world, medieval + magic aesthetic' },
    { id: 'cyberpunk', name: 'Cyberpunk Anime', description: 'Neon, high-tech, dystopian' },
    { id: 'ghibli', name: 'Ghibli-inspired', description: 'Soft, whimsical, nature-focused' },
  ],
}

// ─── Upwork-Ready Task Templates ────────────────────────────────────────────

export const UPWORK_TEMPLATES = {
  landing_page: {
    name: 'Landing Page Design',
    agents: ['architect', 'frontend', 'copy', 'reviewer'],
    skills: ['kupuri-frontend-SKILL.md', 'design-principles-SKILL.md', 'pass-framework-SKILL.md'],
    deliverables: ['3 HTML variations', 'Mobile responsive', 'Copy deck', 'UDEC audit report'],
  },
  brand_identity: {
    name: 'Brand Identity Package',
    agents: ['architect', 'frontend', 'copy', 'packaging'],
    skills: ['brand-SKILL.md', 'color-psychology-SKILL.md', 'luxury-psychology-SKILL.md'],
    deliverables: ['Logo variations', 'Color palette', 'Typography system', 'Brand guidelines PDF'],
  },
  video_production: {
    name: 'Video Production',
    agents: ['motion', 'spatial', 'copy'],
    skills: ['motion-SKILL.md', 'seedance-video-SKILL.md'],
    deliverables: ['Storyboard', 'Motion graphics', 'Final video export'],
  },
  anime_character: {
    name: 'Anime Character Design',
    agents: ['alex'],
    skills: ['anime-character-SKILL.md'],
    deliverables: ['Character sheet', 'Expression reference', 'Color variations', 'Turnaround views'],
  },
  '3d_world': {
    name: '3D World Creation',
    agents: ['spatial', 'motion'],
    skills: ['3d-world-SKILL.md', 'hy-worldplay-SKILL.md'],
    deliverables: ['KSPLAT world file', 'Flythrough video', 'Browser embed code'],
  },
}

// ─── Alex Skill Files ───────────────────────────────────────────────────────

export const ALEX_SKILLS = [
  ...SKILLS,
  {
    id: 'agent-orchestration',
    name: 'Agent Orchestration',
    file: 'agent-orchestration-SKILL.md',
    domain: 'Meta',
    description: 'Coordinate multiple agents for complex tasks. Route work intelligently.',
    triggers: ['orchestrate', 'coordinate', 'multi-agent', 'delegate'],
  },
  {
    id: 'sub-agent-spawning',
    name: 'Sub-Agent Spawning',
    file: 'sub-agent-spawning-SKILL.md',
    domain: 'Meta',
    description: 'Spawn parallel sub-agents for concurrent workstreams.',
    triggers: ['spawn', 'parallel', 'sub-agent', 'concurrent'],
  },
  {
    id: 'anime-character',
    name: 'Anime Character Design',
    file: 'anime-character-SKILL.md',
    domain: 'Anime',
    description: 'Generate consistent anime characters with full reference sheets.',
    triggers: ['anime character', 'waifu', 'husbando', 'character design', 'oc'],
  },
  {
    id: 'manga-panel',
    name: 'Manga Panel Generation',
    file: 'manga-panel-SKILL.md',
    domain: 'Anime',
    description: 'Create manga pages with proper panel composition and flow.',
    triggers: ['manga', 'panel', 'comic', 'page layout'],
  },
  {
    id: 'sakuga-animation',
    name: 'Sakuga Animation',
    file: 'sakuga-animation-SKILL.md',
    domain: 'Anime',
    description: 'High-quality anime animation sequences and sakuga cuts.',
    triggers: ['sakuga', 'anime animation', 'action sequence', 'transformation'],
  },
  {
    id: 'vtuber-assets',
    name: 'VTuber Asset Generation',
    file: 'vtuber-assets-SKILL.md',
    domain: 'Anime',
    description: 'Generate Live2D-ready VTuber character assets.',
    triggers: ['vtuber', 'live2d', 'virtual youtuber', 'streaming avatar'],
  },
  {
    id: 'generative-image',
    name: 'Generative Image',
    file: 'generative-image-SKILL.md',
    domain: 'Generative',
    description: 'Full image generation capabilities with 105+ models.',
    triggers: ['generate image', 'create image', 'ai image', 'flux', 'midjourney'],
  },
  {
    id: 'generative-video',
    name: 'Generative Video',
    file: 'generative-video-SKILL.md',
    domain: 'Generative',
    description: 'AI video generation with Kling, Sora, Veo, and more.',
    triggers: ['generate video', 'ai video', 'kling', 'sora', 'veo'],
  },
  {
    id: 'upwork-execution',
    name: 'Upwork Task Execution',
    file: 'upwork-execution-SKILL.md',
    domain: 'Business',
    description: 'Execute freelance tasks with professional deliverables.',
    triggers: ['upwork', 'freelance', 'client work', 'deliverable'],
  },
]

// ─── Get All Active Agents Under Alex ───────────────────────────────────────

export function getAllAgentsUnderAlex(): typeof AGENTS[number][] {
  return [
    AGENT_ALEX,
    ...AGENTS,
  ] as typeof AGENTS[number][]
}

export function getActiveSubAgents(): SubAgent[] {
  return ALEX_SUB_AGENTS.filter(a => a.status === 'active' || a.status === 'spawning')
}

export function getAgentHierarchy() {
  return {
    master: AGENT_ALEX,
    coreAgents: AGENTS,
    subAgents: ALEX_SUB_AGENTS,
    totalActive: 1 + AGENTS.length + getActiveSubAgents().length,
    capabilities: AGENT_ALEX.capabilities,
    modes: ['standard', 'anime', 'generative', 'upwork'],
  }
}
