'use client'

import { useState } from 'react'
import ChatMain from '@/components/chat/ChatMain'
import ContextPanel from '@/components/chat/ContextPanel'
import { useChat } from '@/hooks/useChat'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function ChatPage() {
  const { messages, isStreaming, send, clearConversation, generationHistory } = useChat()
  const [inputValue, setInputValue] = useState('')
  const [showGraph, setShowGraph] = useState(false)

  function handleSend(content: string) {
    setInputValue('')
    send(content)
  }

  return (
    <main className="synthia-workspace">
      <div className="synthia-topbar">
        <a className="synthia-brand" href="/" aria-label="Synthia home">
          <span className="synthia-brand-mark">S</span>
          <span>SYNTHIA</span>
        </a>
        <div className="synthia-topbar-actions">
          <button className="synthia-quiet-button" onClick={clearConversation}>New</button>
          <button
            className={`synthia-mode-button ${showGraph ? 'is-active' : ''}`}
            onClick={() => setShowGraph(v => !v)}
            aria-pressed={showGraph}
          >
            {showGraph ? 'Conversation' : 'Sphere view'}
          </button>
        </div>
      </div>

      <ErrorBoundary>
        <section className="synthia-stage">
          {showGraph ? (
            <ContextPanel isGenerating={isStreaming} history={generationHistory} immersive />
          ) : (
            <ChatMain
              messages={messages}
              isStreaming={isStreaming}
              onSend={handleSend}
              onClear={clearConversation}
              inputValue={inputValue}
              onInputChange={setInputValue}
            />
          )}
        </section>
      </ErrorBoundary>
    </main>
  )
}