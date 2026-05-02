'use client'

import { useState } from 'react'
import { ANIME_MODE } from '@/lib/agent-alex'
import { getAnimeModels } from '@/lib/skills/generative-ai-skills'

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
  // Anime-specific accent colors
  sakura: '#ffb7c5',
  neon: '#00f5ff',
  violet: '#9d4edd',
}

type GeneratorKey = keyof typeof ANIME_MODE.generators
type StyleKey = typeof ANIME_MODE.styles[number]['id']

const animeModels = getAnimeModels()

export default function AnimeModePage() {
  const [activeGenerator, setActiveGenerator] = useState<GeneratorKey>('character')
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>('shonen')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('low quality, blurry, bad anatomy, extra limbs')
  const [selectedModel, setSelectedModel] = useState('animagine-xl')
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<Array<{ id: string; url: string; prompt: string }>>([])

  const currentGenerator = ANIME_MODE.generators[activeGenerator]
  const currentStyle = ANIME_MODE.styles.find(s => s.id === selectedStyle)

  async function handleGenerate() {
    if (!prompt.trim() || generating) return
    setGenerating(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: `${currentStyle?.name} anime style, ${prompt}`,
          negativePrompt,
          mode: 'anime',
          width: 1024,
          height: 1024,
        }),
      })

      const data = await res.json()
      if (data.outputUrl) {
        setResults(prev => [{
          id: data.id,
          url: data.outputUrl,
          prompt,
        }, ...prev])
      }
    } catch (error) {
      console.error('[v0] Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${C.sakura}, ${C.neon})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d0f0e" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '0.625rem', color: C.dim, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Studio OS · Agent Alex
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 300,
              color: C.text,
              letterSpacing: '-0.01em',
            }}>
              Anime Mode
            </h1>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: '0.9375rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Full anime creation pipeline with {animeModels.length}+ specialized models for characters, manga, sakuga animation, and VTuber assets.
        </p>
      </div>

      {/* Generator Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}>
        {(Object.keys(ANIME_MODE.generators) as GeneratorKey[]).map(key => {
          const gen = ANIME_MODE.generators[key]
          const isActive = activeGenerator === key
          return (
            <button
              key={key}
              onClick={() => setActiveGenerator(key)}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '100px',
                background: isActive ? C.sakura : 'transparent',
                border: `1px solid ${isActive ? C.sakura : C.border}`,
                color: isActive ? '#0d0f0e' : C.dim,
                fontSize: '0.8125rem',
                fontWeight: isActive ? 500 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
              }}
            >
              {gen.name}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

        {/* Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Generator Info */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${C.sakura}, ${C.neon}, ${C.sakura})`,
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', color: C.text, marginBottom: '0.25rem' }}>
                  {currentGenerator.name}
                </h2>
                <p style={{ fontSize: '0.8125rem', color: C.muted }}>{currentGenerator.description}</p>
              </div>
            </div>

            {/* Output Types */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {currentGenerator.outputTypes.map(type => (
                <span key={type} style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '4px',
                  background: 'rgba(255,183,197,0.1)',
                  border: '1px solid rgba(255,183,197,0.2)',
                  color: C.sakura,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.04em',
                }}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
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
              placeholder={`Describe your ${activeGenerator}... e.g., "A fierce warrior girl with silver hair, wielding a katana, cherry blossoms falling"`}
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

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              style={{
                marginTop: '1.25rem',
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                background: prompt.trim() && !generating
                  ? `linear-gradient(135deg, ${C.sakura}, ${C.neon})`
                  : 'rgba(255,255,255,0.05)',
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
                    width: '16px',
                    height: '16px',
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
                  Generate {currentGenerator.name}
                </>
              )}
            </button>
          </div>

          {/* Results Grid */}
          {results.length > 0 && (
            <div>
              <p style={{
                fontSize: '0.6875rem',
                color: C.dim,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}>
                Generated ({results.length})
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                {results.map(result => (
                  <div key={result.id} style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      aspectRatio: '1',
                      background: `url(${result.url}) center/cover`,
                    }} />
                    <div style={{ padding: '0.75rem' }}>
                      <p style={{
                        fontSize: '0.75rem',
                        color: C.muted,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {result.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Style Selector */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <p style={{
              fontSize: '0.6875rem',
              color: C.dim,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              Anime Style
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {ANIME_MODE.styles.map(style => {
                const isActive = selectedStyle === style.id
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id as StyleKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      background: isActive ? 'rgba(255,183,197,0.1)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(255,183,197,0.2)' : 'transparent'}`,
                      color: isActive ? C.sakura : C.dim,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      transition: 'all 120ms ease',
                    }}
                  >
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isActive ? C.sakura : C.dim,
                      flexShrink: 0,
                    }} />
                    <div>
                      <p style={{ fontWeight: isActive ? 500 : 400 }}>{style.name}</p>
                      <p style={{ fontSize: '0.6875rem', color: C.dim, marginTop: '0.125rem' }}>
                        {style.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Selector */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <p style={{
              fontSize: '0.6875rem',
              color: C.dim,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              AI Model ({animeModels.length} available)
            </p>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${C.border}`,
                borderRadius: '7px',
                padding: '0.625rem 0.875rem',
                color: C.text,
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              {animeModels.map(model => (
                <option key={model.id} value={model.id} style={{ background: '#0d0f0e' }}>
                  {model.name} ({model.quality})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Templates */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <p style={{
              fontSize: '0.6875rem',
              color: C.dim,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              Quick Templates
            </p>
            {[
              { label: 'Anime Girl Portrait', prompt: 'beautiful anime girl, detailed eyes, flowing hair, soft lighting, studio ghibli style' },
              { label: 'Action Scene', prompt: 'dynamic action pose, speed lines, dramatic lighting, shonen style battle scene' },
              { label: 'VTuber Design', prompt: 'vtuber character design, cute style, colorful outfit, expressive face, live2d ready' },
              { label: 'Mecha Pilot', prompt: 'mecha pilot in cockpit, dramatic lighting, detailed mechanical elements, gundam style' },
            ].map(template => (
              <button
                key={template.label}
                onClick={() => setPrompt(template.prompt)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.375rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 120ms ease',
                }}
              >
                {template.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            background: C.goldDim,
            border: `1px solid rgba(201,169,110,0.15)`,
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <p style={{
              fontSize: '0.6875rem',
              color: C.gold,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              Anime Mode Stats
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Models', value: animeModels.length },
                { label: 'Styles', value: ANIME_MODE.styles.length },
                { label: 'Generators', value: Object.keys(ANIME_MODE.generators).length },
                { label: 'Generated', value: results.length },
              ].map(stat => (
                <div key={stat.label}>
                  <p style={{ fontSize: '1.25rem', color: C.text, fontWeight: 300 }}>{stat.value}</p>
                  <p style={{ fontSize: '0.6875rem', color: C.dim }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
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
