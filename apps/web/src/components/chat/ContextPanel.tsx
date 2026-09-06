'use client'

interface GenerationHistoryItem {
  url: string
  tool: string
  timestamp: number
}

interface ContextPanelProps {
  isGenerating: boolean
  history: GenerationHistoryItem[]
  immersive?: boolean
}

const fallbackNodes = [
  { label: 'Outcome', detail: 'What you want', x: 50, y: 50, size: 154 },
  { label: 'Context', detail: 'What Synthia knows', x: 23, y: 27, size: 92 },
  { label: 'Create', detail: 'Image · video · content', x: 77, y: 28, size: 106 },
  { label: 'Brain', detail: 'Memory & decisions', x: 24, y: 73, size: 98 },
  { label: 'Deliver', detail: 'Finished result', x: 77, y: 73, size: 88 },
]

export default function ContextPanel({ isGenerating, history, immersive = false }: ContextPanelProps) {
  const recent = history.slice(0, 4)
  const nodes = fallbackNodes.map((node, index) => ({
    ...node,
    detail: recent[index - 1]?.tool ? `Recent · ${recent[index - 1].tool}` : node.detail,
  }))

  return (
    <div className={immersive ? 'sphere-experience' : 'sphere-experience sphere-experience--panel'}>
      <div className="sphere-copy">
        <span className="synthia-eyebrow">LIVE SYSTEM MAP</span>
        <h2>Your outcome is the center.</h2>
        <p>Synthia coordinates the tools underneath. Select a sphere to understand the work without managing it.</p>
      </div>

      <div className={`sphere-map ${isGenerating ? 'is-thinking' : ''}`} role="img" aria-label="Interactive map of Synthia's outcome, context, creation, memory and delivery system">
        <svg className="sphere-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {nodes.slice(1).map((node) => (
            <line key={node.label} x1="50" y1="50" x2={node.x} y2={node.y} />
          ))}
        </svg>
        {nodes.map((node, index) => (
          <button
            key={node.label}
            className={`sphere-node ${index === 0 ? 'sphere-node--core' : ''}`}
            style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.size, height: node.size }}
            title={node.detail}
          >
            <span className="sphere-node-glow" />
            <strong>{node.label}</strong>
            <small>{node.detail}</small>
          </button>
        ))}
        {isGenerating && <div className="sphere-status">Synthia is orchestrating your outcome…</div>}
      </div>

      <div className="sphere-legend">
        <span><i className="sphere-dot sphere-dot--live" /> Active</span>
        <span><i className="sphere-dot" /> Available</span>
        <span>Drag the mental model, not the machinery.</span>
      </div>
    </div>
  )
}