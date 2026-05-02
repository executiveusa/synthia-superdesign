'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AGENT_ALEX, ALEX_SKILLS, getAllAgentsUnderAlex, UPWORK_TEMPLATES, SubAgent, createSubAgent } from '@/lib/agent-alex'
import { AGENTS } from '@/lib/studio-config'
import { MODEL_STATS } from '@/lib/skills/generative-ai-skills'

const C = {
  border: 'rgba(255,255,255,0.07)',
  surface: 'rgba(255,255,255,0.025)',
  gold: '#c9a96e',
  goldDim: 'rgba(201,169,110,0.08)',
  text: '#f0ede6',
  muted: '#8a8780',
  dim: '#5a5855',
  success: '#6ea87e',
  error: '#e87070',
  alex: '#ff6b35', // Agent Alex signature orange
  alexDim: 'rgba(255,107,53,0.1)',
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: Date
}

type Tab = 'chat' | 'agents' | 'skills' | 'spawn'

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.75rem 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '4px', height: '4px', borderRadius: '50%', background: C.alex,
          animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1.25rem',
    }}>
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, marginRight: '0.75rem',
          background: C.alexDim, border: `1px solid rgba(255,107,53,0.3)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
        }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.04em', color: C.alex }}>A</span>
        </div>
      )}
      <div style={{
        maxWidth: '72%',
        background: isUser ? 'rgba(255,107,53,0.1)' : C.surface,
        border: `1px solid ${isUser ? 'rgba(255,107,53,0.2)' : C.border}`,
        borderRadius: isUser ? '14px 14px 2px 14px' : '2px 14px 14px 14px',
        padding: '0.875rem 1.125rem',
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: isUser ? C.text : C.muted,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </p>
        <p style={{ fontSize: '0.5625rem', color: '#3a3835', marginTop: '0.375rem', textAlign: isUser ? 'right' : 'left' }}>
          {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default function AgentAlexPage() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I am Agent Alex, your Master Orchestrator.

I command all 12 core studio agents and can spawn unlimited sub-agents for parallel workstreams. My capabilities include:

- **Multi-Agent Orchestration**: Route complex tasks across specialized agents
- **Sub-Agent Spawning**: Create parallel workstreams (Claude Code-style)
- **Full Generative AI**: ${MODEL_STATS.totalModels}+ models for image, video, audio, and lipsync
- **Anime Mode**: Character design, manga panels, sakuga animation, VTuber assets
- **Upwork Execution**: Professional-grade deliverables for freelance work

What would you like to build today?`,
      ts: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [subAgents, setSubAgents] = useState<SubAgent[]>([])
  const [spawnName, setSpawnName] = useState('')
  const [spawnTask, setSpawnTask] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const content = input.trim()
    if (!content || streaming) return

    setInput('')
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content, ts: new Date() }
    setMessages(prev => [...prev, userMsg])

    const assistantId = `a_${Date.now()}`
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', ts: new Date() }])
    setStreaming(true)

    try {
      const res = await fetch('/api/alex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          messages: [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: data.content ?? data.error ?? 'No response' } : m
      ))
    } catch (error) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: `Error: ${error}` } : m
      ))
    } finally {
      setStreaming(false)
    }
  }

  async function spawnSubAgent() {
    if (!spawnName.trim() || !spawnTask.trim()) return

    const newSubAgent = createSubAgent(spawnName, spawnTask)
    setSubAgents(prev => [...prev, newSubAgent])
    setSpawnName('')
    setSpawnTask('')

    // Call API to spawn
    try {
      const res = await fetch('/api/alex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'spawn-sub-agent',
          subAgentConfig: {
            name: spawnName,
            task: spawnTask,
          },
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubAgents(prev => prev.map(a =>
          a.id === newSubAgent.id ? { ...a, status: 'active' } : a
        ))
      }
    } catch (error) {
      setSubAgents(prev => prev.map(a =>
        a.id === newSubAgent.id ? { ...a, status: 'error' } : a
      ))
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const allAgents = getAllAgentsUnderAlex()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Header */}
      <div style={{ padding: '1.5rem 0 1rem', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `linear-gradient(135deg, ${C.alex}, #ff8c42)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px rgba(255,107,53,0.3)`,
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>A</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.375rem',
                  fontWeight: 400,
                  color: C.text,
                  letterSpacing: '0.02em',
                }}>
                  Agent Alex
                </h1>
                <span style={{
                  fontSize: '0.5625rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: C.alexDim,
                  color: C.alex,
                }}>
                  Hermes-class
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: C.dim }}>
                Master Orchestrator · {allAgents.length} agents · {ALEX_SKILLS.length} skills · {MODEL_STATS.totalModels}+ AI models
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/dashboard/anime" style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background: 'rgba(255,183,197,0.1)',
              border: '1px solid rgba(255,183,197,0.2)',
              color: '#ffb7c5',
              fontSize: '0.75rem',
              textDecoration: 'none',
            }}>
              Anime Mode
            </Link>
            <Link href="/dashboard/generative" style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background: C.goldDim,
              border: '1px solid rgba(201,169,110,0.2)',
              color: C.gold,
              fontSize: '0.75rem',
              textDecoration: 'none',
            }}>
              Generative AI
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem' }}>
          {(['chat', 'agents', 'skills', 'spawn'] as Tab[]).map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px 6px 0 0',
                  background: isActive ? C.surface : 'transparent',
                  border: `1px solid ${isActive ? C.border : 'transparent'}`,
                  borderBottom: isActive ? 'none' : `1px solid ${C.border}`,
                  color: isActive ? C.text : C.dim,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'spawn' ? 'Spawn Sub-Agent' : tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem 0' }}>

        {activeTab === 'chat' && (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}

        {activeTab === 'agents' && (
          <div>
            <p style={{ fontSize: '0.6875rem', color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              All Agents Under Alex ({allAgents.length} total)
            </p>

            {/* Alex Card */}
            <div style={{
              background: C.alexDim,
              border: `1px solid rgba(255,107,53,0.2)`,
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent, ${C.alex}, transparent)`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: C.success, boxShadow: `0 0 8px ${C.success}88`,
                }} />
                <h3 style={{ fontSize: '1rem', color: C.text }}>{AGENT_ALEX.name}</h3>
                <span style={{
                  fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '0.2rem 0.5rem', borderRadius: '3px',
                  background: 'rgba(255,107,53,0.2)', color: C.alex,
                }}>
                  {AGENT_ALEX.class}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: C.muted, marginBottom: '0.75rem' }}>
                {AGENT_ALEX.scope}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {AGENT_ALEX.capabilities.slice(0, 4).map(cap => (
                  <span key={cap} style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)', fontSize: '0.6875rem', color: C.dim,
                  }}>
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Agents Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {AGENTS.map(agent => (
                <div key={agent.id} style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.color }} />
                    <h4 style={{ fontSize: '0.875rem', color: C.text }}>{agent.name}</h4>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: C.gold, marginBottom: '0.375rem' }}>{agent.role}</p>
                  <p style={{ fontSize: '0.75rem', color: C.dim, lineHeight: 1.4 }}>{agent.scope}</p>
                </div>
              ))}
            </div>

            {/* Active Sub-Agents */}
            {subAgents.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.6875rem', color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Active Sub-Agents ({subAgents.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {subAgents.map(sub => (
                    <div key={sub.id} style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: C.text }}>{sub.name}</p>
                        <p style={{ fontSize: '0.75rem', color: C.dim }}>{sub.task}</p>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.5rem', borderRadius: '4px',
                        background: sub.status === 'active' ? 'rgba(110,168,126,0.1)' : 'rgba(255,255,255,0.05)',
                        color: sub.status === 'active' ? C.success : C.dim,
                        fontSize: '0.6875rem',
                      }}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <p style={{ fontSize: '0.6875rem', color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Alex Skills Registry ({ALEX_SKILLS.length} skills)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
              {ALEX_SKILLS.map(skill => (
                <div key={skill.id} style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', color: C.text }}>{skill.name}</h4>
                    <span style={{
                      padding: '0.2rem 0.5rem', borderRadius: '4px',
                      background: C.goldDim, color: C.gold,
                      fontSize: '0.5625rem', letterSpacing: '0.06em',
                    }}>
                      {skill.domain}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: C.muted, lineHeight: 1.4, marginBottom: '0.625rem' }}>
                    {skill.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {skill.triggers.slice(0, 3).map(trigger => (
                      <span key={trigger} style={{
                        padding: '0.15rem 0.4rem', borderRadius: '3px',
                        background: 'rgba(255,255,255,0.03)', fontSize: '0.625rem', color: C.dim,
                      }}>
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'spawn' && (
          <div style={{ maxWidth: '600px' }}>
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <p style={{ fontSize: '0.875rem', color: C.text, marginBottom: '1rem' }}>
                Spawn a new sub-agent to work on a parallel task. Sub-agents run concurrently and report back to Alex.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.6875rem', color: C.dim,
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem',
                }}>
                  Sub-Agent Name
                </label>
                <input
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  placeholder="e.g., Character Designer, Copywriter, Animator"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                    borderRadius: '7px', padding: '0.625rem 0.875rem', color: C.text,
                    fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.6875rem', color: C.dim,
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem',
                }}>
                  Task Description
                </label>
                <textarea
                  value={spawnTask}
                  onChange={e => setSpawnTask(e.target.value)}
                  placeholder="Describe what this sub-agent should accomplish..."
                  rows={3}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                    borderRadius: '7px', padding: '0.625rem 0.875rem', color: C.text,
                    fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                  }}
                />
              </div>

              <button
                onClick={spawnSubAgent}
                disabled={!spawnName.trim() || !spawnTask.trim()}
                style={{
                  width: '100%', padding: '0.875rem', borderRadius: '8px',
                  background: spawnName.trim() && spawnTask.trim() ? C.alex : 'rgba(255,255,255,0.05)',
                  color: spawnName.trim() && spawnTask.trim() ? '#fff' : C.dim,
                  border: 'none', fontSize: '0.9375rem', fontWeight: 500,
                  cursor: spawnName.trim() && spawnTask.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Spawn Sub-Agent
              </button>
            </div>

            {/* Upwork Templates */}
            <p style={{ fontSize: '0.6875rem', color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Quick Templates (Upwork-Ready)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(UPWORK_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSpawnName(`${template.name} Agent`)
                    setSpawnTask(`Execute ${template.name.toLowerCase()} task with deliverables: ${template.deliverables.join(', ')}`)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', borderRadius: '8px',
                    background: C.surface, border: `1px solid ${C.border}`,
                    color: C.muted, fontSize: '0.8125rem', cursor: 'pointer',
                    fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <div>
                    <p style={{ color: C.text, marginBottom: '0.25rem' }}>{template.name}</p>
                    <p style={{ fontSize: '0.6875rem', color: C.dim }}>
                      {template.agents.length} agents · {template.deliverables.length} deliverables
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input (Chat tab only) */}
      {activeTab === 'chat' && (
        <div style={{ padding: '0 0 1.5rem', flexShrink: 0 }}>
          <div style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
            background: C.surface, border: `1px solid ${streaming ? 'rgba(255,107,53,0.3)' : C.border}`,
            borderRadius: '12px', padding: '0.75rem 0.875rem',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Alex to orchestrate tasks, spawn sub-agents, generate content..."
              disabled={streaming}
              rows={1}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: C.text, fontSize: '0.875rem', lineHeight: 1.6, resize: 'none',
                fontFamily: 'inherit', maxHeight: '120px', overflowY: 'auto',
              }}
            />
            <button
              onClick={() => streaming ? abortRef.current?.abort() : send()}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: streaming ? 'rgba(232,112,112,0.15)' : input.trim() ? C.alex : 'rgba(255,255,255,0.04)',
                border: 'none', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {streaming ? (
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: C.error }} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke={input.trim() ? '#fff' : C.dim} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
