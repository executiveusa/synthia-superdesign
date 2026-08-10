'use client'

import { useEffect, useRef } from 'react'
import GenerationCard from './GenerationCard'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  generation?: { resultUrl: string; tool: string; prompt?: string }
}

interface ChatMainProps {
  messages: Message[]
  isStreaming: boolean
  onSend: (content: string) => void
  onClear: () => void
  inputValue: string
  onInputChange: (v: string) => void
}

const STARTERS = [
  'Create a launch campaign for my product',
  'Turn my idea into a polished visual',
  'Help me decide what to build next',
]

export default function ChatMain({ messages, isStreaming, onSend, inputValue, onInputChange }: ChatMainProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function autoResize() {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px'
  }

  function submit() {
    if (inputValue.trim() && !isStreaming) onSend(inputValue.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const empty = messages.length === 0

  return (
    <div className={`outcome-chat ${empty ? 'outcome-chat--empty' : ''}`}>
      <div className="outcome-scroll">
        {empty ? (
          <section className="outcome-hero">
            <span className="synthia-eyebrow">SOVEREIGN AI STUDIO</span>
            <h1>What outcome do you want?</h1>
            <p>Describe the result. Synthia decides which models, tools and workflows are needed underneath.</p>
            <div className="outcome-starters" aria-label="Example outcomes">
              {STARTERS.map(starter => (
                <button key={starter} onClick={() => onInputChange(starter)}>{starter}</button>
              ))}
            </div>
          </section>
        ) : (
          <div className="conversation-stream">
            {messages.map(msg => (
              <article key={msg.id} className={`conversation-turn conversation-turn--${msg.role}`}>
                <span className="conversation-speaker">{msg.role === 'assistant' ? 'Synthia' : 'You'}</span>
                {msg.generation ? (
                  <GenerationCard resultUrl={msg.generation.resultUrl} tool={msg.generation.tool} prompt={msg.generation.prompt} />
                ) : (
                  <div className="conversation-content">
                    {msg.content}
                    {isStreaming && msg.role === 'assistant' && msg === messages[messages.length - 1] && <span className="thinking-caret" />}
                  </div>
                )}
              </article>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="outcome-composer-shell">
        <div className="outcome-composer">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={e => { onInputChange(e.target.value); autoResize() }}
            onKeyDown={handleKeyDown}
            placeholder="Tell Synthia the outcome — not the steps…"
            rows={1}
            aria-label="Describe your desired outcome"
          />
          <div className="composer-footer">
            <div className="composer-capabilities">
              <span>Context aware</span><span>200+ models</span><span>Private by design</span>
            </div>
            <button className="composer-send" onClick={submit} disabled={!inputValue.trim() || isStreaming} aria-label="Send outcome">
              {isStreaming ? <span className="composer-loader" /> : '↑'}
            </button>
          </div>
        </div>
        <p className="composer-hint">Enter to send · Shift + Enter for a new line</p>
      </div>
    </div>
  )
}