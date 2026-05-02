'use client'

import { useState } from 'react'
import {
  IMAGE_MODELS,
  VIDEO_MODELS,
  AUDIO_MODELS,
  LIPSYNC_MODELS,
  MODEL_STATS,
  getModelById,
} from '@/lib/skills/generative-ai-skills'

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
}

type Tab = 'image' | 'video' | 'audio' | 'lipsync'

const TAB_CONFIG = {
  image: { label: 'Image Generation', models: IMAGE_MODELS, color: '#6ea87e' },
  video: { label: 'Video Generation', models: VIDEO_MODELS, color: '#c9a96e' },
  audio: { label: 'Audio Generation', models: AUDIO_MODELS, color: '#8fb8d4' },
  lipsync: { label: 'Lipsync', models: LIPSYNC_MODELS, color: '#d4916e' },
}

export default function GenerativeAIPage() {
  const [activeTab, setActiveTab] = useState<Tab>('image')
  const [selectedModel, setSelectedModel] = useState('flux-dev')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{ url?: string; error?: string } | null>(null)

  const currentConfig = TAB_CONFIG[activeTab]
  const currentModel = getModelById(selectedModel)

  async function handleGenerate() {
    if (!prompt.trim() || generating) return
    setGenerating(true)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt,
          negativePrompt,
          width: 1024,
          height: 1024,
        }),
      })

      const data = await res.json()
      if (data.outputUrl) {
        setResult({ url: data.outputUrl })
      } else if (data.error) {
        setResult({ error: data.error })
      } else if (data.status === 'queued') {
        setResult({ error: `Generation queued. ID: ${data.id}. Check back in ~30 seconds.` })
      }
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.625rem', color: C.dim, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Studio OS · Agent Alex
        </p>
        <h1 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 300,
          color: C.text,
          letterSpacing: '-0.01em',
          marginBottom: '0.375rem',
        }}>
          Generative AI Studio
        </h1>
        <p style={{ color: C.muted, fontSize: '0.9375rem' }}>
          {MODEL_STATS.totalModels}+ models for image, video, audio, and lipsync generation. Powered by Open-Generative-AI.
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}>
        {[
          { label: 'Image Models', value: MODEL_STATS.imageModels, color: '#6ea87e' },
          { label: 'Video Models', value: MODEL_STATS.videoModels, color: '#c9a96e' },
          { label: 'Audio Models', value: MODEL_STATS.audioModels, color: '#8fb8d4' },
          { label: 'Lipsync Models', value: MODEL_STATS.lipsyncModels, color: '#d4916e' },
          { label: 'Anime Models', value: MODEL_STATS.animeModels, color: '#ffb7c5' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            minWidth: '140px',
          }}>
            <p style={{ fontSize: '1.5rem', color: stat.color, fontWeight: 300, marginBottom: '0.125rem' }}>
              {stat.value}+
            </p>
            <p style={{ fontSize: '0.6875rem', color: C.dim }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(Object.keys(TAB_CONFIG) as Tab[]).map(tab => {
          const config = TAB_CONFIG[tab]
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSelectedModel(config.models[0]?.id ?? '')
              }}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '100px',
                background: isActive ? config.color : 'transparent',
                border: `1px solid ${isActive ? config.color : C.border}`,
                color: isActive ? '#0d0f0e' : C.dim,
                fontSize: '0.8125rem',
                fontWeight: isActive ? 500 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {config.label} ({config.models.length})
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>

        {/* Model Grid */}
        <div>
          <p style={{
            fontSize: '0.6875rem',
            color: C.dim,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Available Models
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.75rem',
            maxHeight: '500px',
            overflowY: 'auto',
            paddingRight: '0.5rem',
          }}>
            {currentConfig.models.map(model => {
              const isSelected = selectedModel === model.id
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  style={{
                    background: isSelected ? `${currentConfig.color}15` : C.surface,
                    border: `1px solid ${isSelected ? currentConfig.color : C.border}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 120ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', color: isSelected ? C.text : C.muted, fontWeight: 400 }}>
                      {model.name}
                    </h4>
                    <span style={{
                      padding: '0.15rem 0.4rem',
                      borderRadius: '3px',
                      background: model.quality === 'ultra' ? 'rgba(201,169,110,0.15)' :
                                 model.quality === 'high' ? 'rgba(110,168,126,0.15)' :
                                 model.quality === 'fast' ? 'rgba(143,184,212,0.15)' : 'rgba(255,255,255,0.05)',
                      color: model.quality === 'ultra' ? C.gold :
                             model.quality === 'high' ? C.success :
                             model.quality === 'fast' ? '#8fb8d4' : C.dim,
                      fontSize: '0.5625rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {model.quality}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: C.dim, marginBottom: '0.5rem' }}>
                    {model.provider}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: C.dim, lineHeight: 1.4 }}>
                    {model.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generation Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Selected Model */}
          {currentModel && (
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(90deg, transparent, ${currentConfig.color}, transparent)`,
              }} />
              <h3 style={{ fontSize: '1rem', color: C.text, marginBottom: '0.375rem' }}>
                {currentModel.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: C.muted, marginBottom: '0.75rem' }}>
                {currentModel.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.2rem 0.5rem', borderRadius: '4px',
                  background: C.goldDim, color: C.gold,
                  fontSize: '0.6875rem',
                }}>
                  {currentModel.provider}
                </span>
                {currentModel.inputTypes.map(type => (
                  <span key={type} style={{
                    padding: '0.2rem 0.5rem', borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)', color: C.dim,
                    fontSize: '0.6875rem',
                  }}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.6875rem',
              color: C.dim,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                padding: '0.875rem 1rem',
                color: C.text,
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            {activeTab === 'image' && (
              <div style={{ marginTop: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  color: C.dim,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}>
                  Negative Prompt
                </label>
                <input
                  value={negativePrompt}
                  onChange={e => setNegativePrompt(e.target.value)}
                  placeholder="What to avoid..."
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${C.border}`,
                    borderRadius: '8px',
                    padding: '0.625rem 1rem',
                    color: C.muted,
                    fontSize: '0.8125rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              style={{
                marginTop: '1.25rem',
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                background: prompt.trim() && !generating ? currentConfig.color : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: prompt.trim() && !generating ? '#0d0f0e' : C.dim,
                fontSize: '0.9375rem',
                fontWeight: 500,
                cursor: prompt.trim() && !generating ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
              }}
            >
              {generating ? (
                <>
                  <div style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(0,0,0,0.2)',
                    borderTopColor: '#0d0f0e',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Generating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L10.5 6.5L15.5 7.5L12 11L13 16L8 13.5L3 16L4 11L0.5 7.5L5.5 6.5L8 2Z" fill="currentColor" />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div style={{
              background: result.error ? 'rgba(232,112,112,0.08)' : C.surface,
              border: `1px solid ${result.error ? 'rgba(232,112,112,0.2)' : C.border}`,
              borderRadius: '12px',
              padding: '1.25rem',
              overflow: 'hidden',
            }}>
              {result.error ? (
                <p style={{ fontSize: '0.875rem', color: C.error }}>{result.error}</p>
              ) : result.url ? (
                <div>
                  <img
                    src={result.url}
                    alt="Generated content"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      marginBottom: '0.75rem',
                    }}
                  />
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      color: C.muted,
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                    }}
                  >
                    Open Full Size
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
