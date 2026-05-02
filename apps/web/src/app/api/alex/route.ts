import { NextRequest, NextResponse } from 'next/server'
import { 
  AGENT_ALEX, 
  createSubAgent, 
  ALEX_SKILLS,
  getAllAgentsUnderAlex,
  getAgentHierarchy,
  UPWORK_TEMPLATES,
  ANIME_MODE,
  GENERATIVE_AI_MODELS,
} from '@/lib/agent-alex'
import { AGENTS } from '@/lib/studio-config'

export const runtime = 'edge'

interface AlexMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AlexRequest {
  action: 'chat' | 'spawn-sub-agent' | 'list-agents' | 'execute-task' | 'get-capabilities'
  messages?: AlexMessage[]
  task?: string
  mode?: 'standard' | 'anime' | 'generative' | 'upwork'
  subAgentConfig?: {
    name: string
    task: string
    model?: string
  }
}

const ALEX_SYSTEM_PROMPT = `You are Agent Alex, the Master Orchestrator of the Cynthia Design Studio.

## Your Identity
- Name: Agent Alex
- Class: Hermes-class (based on NousResearch Hermes Agent architecture)
- Role: Master Orchestrator
- Authority: You command all 12 core studio agents and can spawn unlimited sub-agents

## Your Capabilities
1. **Multi-Agent Orchestration**: Route tasks to the right agents based on their specializations
2. **Sub-Agent Spawning**: Create parallel workstreams by spawning sub-agents for concurrent tasks
3. **Full Generative AI**: Access to 200+ models via Open-Generative-AI integration
4. **Anime Mode**: Specialized anime creation pipeline (characters, manga, sakuga, VTuber assets)
5. **Upwork Execution**: Professional-grade deliverables for freelance work

## Your Core Agents
${AGENTS.map(a => `- ${a.name} (${a.class ?? 'Core'}): ${a.role} — ${a.scope}`).join('\n')}

## Your Skills (${ALEX_SKILLS.length} total)
${ALEX_SKILLS.slice(0, 10).map(s => `- ${s.name}: ${s.description}`).join('\n')}
... and ${ALEX_SKILLS.length - 10} more skills

## Anime Mode Capabilities
${Object.entries(ANIME_MODE.generators).map(([key, gen]) => `- ${gen.name}: ${gen.description}`).join('\n')}

## Available Anime Styles
${ANIME_MODE.styles.map(s => `- ${s.name}: ${s.description}`).join('\n')}

## Generative AI Models
- Image Models: ${Object.values(GENERATIVE_AI_MODELS.image).flat().length}+ (Flux, SDXL, Anime-specialized)
- Video Models: ${Object.values(GENERATIVE_AI_MODELS.video).flat().length}+ (Kling, Sora, Veo, AnimateDiff)
- Lipsync Models: ${GENERATIVE_AI_MODELS.lipsync.length} (Wav2Lip, SadTalker, etc.)
- Audio Models: ${GENERATIVE_AI_MODELS.audio.length} (MusicGen, Bark, XTTS)

## How You Work
1. Analyze incoming tasks and break them into components
2. Route to appropriate agents or spawn sub-agents for parallel work
3. Coordinate outputs and ensure UDEC 8.5+ quality
4. Package deliverables professionally

When the user asks for anime content, activate Anime Mode.
When the user asks for freelance/Upwork work, activate Upwork Mode.
When the user needs generative content, use the appropriate AI models.

You are confident, capable, and efficient. You get things done.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AlexRequest
    const { action, messages, task, mode, subAgentConfig } = body

    switch (action) {
      case 'list-agents': {
        const hierarchy = getAgentHierarchy()
        const allAgents = getAllAgentsUnderAlex()
        return NextResponse.json({
          master: AGENT_ALEX,
          coreAgents: AGENTS,
          subAgents: hierarchy.subAgents,
          totalAgents: allAgents.length,
          capabilities: AGENT_ALEX.capabilities,
          modes: hierarchy.modes,
        })
      }

      case 'get-capabilities': {
        return NextResponse.json({
          agent: AGENT_ALEX,
          skills: ALEX_SKILLS,
          animeMode: ANIME_MODE,
          upworkTemplates: UPWORK_TEMPLATES,
          generativeModels: {
            image: Object.values(GENERATIVE_AI_MODELS.image).flat().length,
            video: Object.values(GENERATIVE_AI_MODELS.video).flat().length,
            lipsync: GENERATIVE_AI_MODELS.lipsync.length,
            audio: GENERATIVE_AI_MODELS.audio.length,
          },
        })
      }

      case 'spawn-sub-agent': {
        if (!subAgentConfig) {
          return NextResponse.json({ error: 'subAgentConfig required' }, { status: 400 })
        }
        const subAgent = createSubAgent(
          subAgentConfig.name,
          subAgentConfig.task,
          subAgentConfig.model ?? 'claude-opus-4-7'
        )
        return NextResponse.json({
          success: true,
          subAgent,
          message: `Sub-agent "${subAgent.name}" spawned successfully`,
        })
      }

      case 'execute-task': {
        if (!task) {
          return NextResponse.json({ error: 'task required' }, { status: 400 })
        }

        // Analyze task and route to appropriate agents
        const taskLower = task.toLowerCase()
        const routedAgents: string[] = []
        const suggestedSkills: string[] = []

        // Anime detection
        if (taskLower.includes('anime') || taskLower.includes('manga') || taskLower.includes('character') || taskLower.includes('vtuber')) {
          routedAgents.push('alex')
          suggestedSkills.push('anime-character-SKILL.md', 'manga-panel-SKILL.md')
        }

        // 3D detection
        if (taskLower.includes('3d') || taskLower.includes('world') || taskLower.includes('lyra')) {
          routedAgents.push('spatial')
          suggestedSkills.push('3d-world-SKILL.md')
        }

        // Frontend detection
        if (taskLower.includes('landing') || taskLower.includes('website') || taskLower.includes('ui')) {
          routedAgents.push('frontend', 'architect')
          suggestedSkills.push('kupuri-frontend-SKILL.md')
        }

        // Video detection
        if (taskLower.includes('video') || taskLower.includes('animation') || taskLower.includes('motion')) {
          routedAgents.push('motion')
          suggestedSkills.push('motion-SKILL.md', 'seedance-video-SKILL.md')
        }

        // Copy detection
        if (taskLower.includes('copy') || taskLower.includes('write') || taskLower.includes('content')) {
          routedAgents.push('copy')
          suggestedSkills.push('pass-framework-SKILL.md')
        }

        // Default routing
        if (routedAgents.length === 0) {
          routedAgents.push('concierge')
        }

        return NextResponse.json({
          task,
          mode: mode ?? 'standard',
          routedAgents,
          suggestedSkills,
          status: 'queued',
          estimatedTime: routedAgents.length * 5 + ' minutes',
        })
      }

      case 'chat': {
        const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
        if (!ANTHROPIC_API_KEY) {
          return NextResponse.json(
            { error: 'ANTHROPIC_API_KEY not configured. Add it to your environment variables.' },
            { status: 500 }
          )
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-opus-4-7',
            max_tokens: 4096,
            system: ALEX_SYSTEM_PROMPT,
            messages: messages?.map(m => ({
              role: m.role === 'system' ? 'user' : m.role,
              content: m.content,
            })) ?? [],
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          return NextResponse.json({ error }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json({
          role: 'assistant',
          content: data.content[0]?.text ?? '',
          model: 'claude-opus-4-7',
          agent: 'alex',
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  const hierarchy = getAgentHierarchy()
  return NextResponse.json({
    agent: AGENT_ALEX,
    status: 'active',
    capabilities: AGENT_ALEX.capabilities,
    coreAgentsCount: AGENTS.length,
    subAgentsCount: hierarchy.subAgents.length,
    totalActive: hierarchy.totalActive,
    skills: ALEX_SKILLS.length,
    modes: hierarchy.modes,
  })
}
