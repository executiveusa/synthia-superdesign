import Nav from '@/components/Nav'
import AuditForm from '@/components/AuditForm'
import ScrollReveal from '@/components/ScrollReveal'

/* ── shared section wrapper ───────────────────────────────── */
function Section({
  id,
  children,
  style,
}: {
  id?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section
      id={id}
      style={{
        padding: '6rem 2.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        ...style,
      }}
    >
      {children}
    </section>
  )
}

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'rgba(255,255,255,0.06)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    />
  )
}

/* ── eyebrow label ───────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      data-reveal
      style={{
        fontSize: '0.6875rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#c9a96e',
        marginBottom: '1.5rem',
      }}
    >
      {children}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 1 — HERO
═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10rem 2.5rem 6rem',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric radial gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Eyebrow */}
        <p
          data-reveal
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            marginBottom: '2rem',
          }}
        >
          Autonomous Design Studio
        </p>

        {/* Headline */}
        <h1
          data-reveal
          data-delay="1"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontSize: 'clamp(2.75rem, 6vw, 6.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#f0ede6',
            maxWidth: '820px',
            marginBottom: '2rem',
          }}
        >
          Your website should feel like{' '}
          <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>your best product.</em>
        </h1>

        {/* Subheadline */}
        <p
          data-reveal
          data-delay="2"
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: '#8a8780',
            maxWidth: '520px',
            marginBottom: '3rem',
          }}
        >
          Cynthia delivers world-class design with the rigour of a top-tier agency, the
          transparency of a design partner, and the speed of automation.
        </p>

        {/* CTAs */}
        <div
          data-reveal
          data-delay="3"
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <a
            href="#audit"
            style={{
              display: 'inline-block',
              background: '#c9a96e',
              color: '#0d0f0e',
              padding: '1rem 2.25rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'background 200ms ease',
            }}
          >
            Get Your Free Site Audit
          </a>
          <a
            href="#process"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8a8780',
              textDecoration: 'none',
              fontSize: '0.875rem',
              letterSpacing: '0.06em',
              transition: 'color 200ms ease',
            }}
          >
            See the process
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          data-reveal
          data-delay="5"
          style={{
            position: 'absolute',
            bottom: '-4rem',
            left: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#5a5855',
            fontSize: '0.6875rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: '24px', height: '1px', background: 'currentColor' }} />
          Scroll to explore
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 2 — PAIN
═══════════════════════════════════════════════════════════ */
function Pain() {
  const problems = [
    { agency: 'Six-week timelines', ai: 'AI cookie-cutter templates' },
    { agency: 'Opaque design decisions', ai: 'Zero brand understanding' },
    { agency: 'Invoices before outcomes', ai: 'Generic layouts for everyone' },
  ]

  return (
    <Section id="pain" style={{ padding: '6rem 2.5rem' }}>
      <Eyebrow>The problem</Eyebrow>
      <h2
        data-reveal
        data-delay="1"
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: '#f0ede6',
          maxWidth: '680px',
          marginBottom: '4rem',
        }}
      >
        Traditional agencies are slow, opaque, and expensive.{' '}
        <span style={{ color: '#5a5855' }}>Generic AI is just generic.</span>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {problems.map((p, i) => (
          <div
            key={i}
            data-reveal
            data-delay={String(i + 1)}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '1.75rem 2rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#e87070', marginTop: '2px', flexShrink: 0 }}>✕</span>
                <span style={{ color: '#8a8780', fontSize: '0.9375rem' }}>{p.agency}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#e87070', marginTop: '2px', flexShrink: 0 }}>✕</span>
                <span style={{ color: '#8a8780', fontSize: '0.9375rem' }}>{p.ai}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 3 — POSITIONING
═══════════════════════════════════════════════════════════ */
function Positioning() {
  const pillars = [
    {
      label: 'Standards',
      desc: 'Every deliverable is benchmarked against UDEC 8.5 — the design quality standard used by the world\'s leading digital brands.',
    },
    {
      label: 'Transparency',
      desc: 'Watch the design room in real time. No black boxes. No surprises. Full visibility from brief to delivery.',
    },
    {
      label: 'Speed',
      desc: 'Hours, not weeks. Autonomous pipelines compress the creative cycle without compressing quality.',
    },
  ]

  return (
    <Section id="studio" style={{ padding: '6rem 2.5rem' }}>
      <Eyebrow>Why Cynthia</Eyebrow>
      <h2
        data-reveal
        data-delay="1"
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: '#f0ede6',
          maxWidth: '680px',
          marginBottom: '4rem',
        }}
      >
        A new kind of design studio.{' '}
        <em style={{ fontStyle: 'italic', color: '#8a8780' }}>Built around outcomes.</em>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {pillars.map((p, i) => (
          <div
            key={i}
            data-reveal
            data-delay={String(i + 1)}
            style={{
              background: '#0d0f0e',
              padding: '2.5rem 2.25rem',
            }}
          >
            <div
              style={{
                width: '2rem',
                height: '2px',
                background: '#c9a96e',
                marginBottom: '1.5rem',
              }}
            />
            <h3
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.625rem',
                fontWeight: 400,
                color: '#f0ede6',
                marginBottom: '1rem',
              }}
            >
              {p.label}
            </h3>
            <p style={{ color: '#8a8780', fontSize: '0.9375rem', lineHeight: 1.7 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 4 — CAPABILITIES
═══════════════════════════════════════════════════════════ */
function Capabilities() {
  const caps = [
    { label: 'Websites', desc: 'Marketing sites & landing pages' },
    { label: 'Applications', desc: 'SaaS dashboards & web apps' },
    { label: 'Motion', desc: 'Animation & interactive experiences' },
    { label: '3D', desc: 'Immersive spatial design' },
    { label: 'Brand', desc: 'Visual identity systems' },
    { label: 'Copy', desc: 'Strategic messaging & UX writing' },
  ]

  return (
    <Section id="work" style={{ padding: '6rem 2.5rem' }}>
      <Eyebrow>Capabilities</Eyebrow>
      <h2
        data-reveal
        data-delay="1"
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: '#f0ede6',
          maxWidth: '680px',
          marginBottom: '4rem',
        }}
      >
        Full-spectrum design delivery.
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {caps.map((cap, i) => (
          <div
            key={i}
            data-reveal
            data-delay={String((i % 4) + 1)}
            className="cap-card"
            style={{
              padding: '2rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.375rem',
                fontWeight: 400,
                color: '#f0ede6',
                marginBottom: '0.5rem',
              }}
            >
              {cap.label}
            </p>
            <p style={{ color: '#5a5855', fontSize: '0.875rem' }}>{cap.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 5 — PROCESS
═══════════════════════════════════════════════════════════ */
function Process() {
  const steps = [
    {
      n: '01',
      label: 'Submit your brief',
      desc: 'Share your goals, references, and brand context through a structured brief — or just start with your site URL.',
    },
    {
      n: '02',
      label: 'Watch the design room',
      desc: 'Cynthia works autonomously and visibly. Monitor the creative process in real time as concepts take shape.',
    },
    {
      n: '03',
      label: 'Receive deliverables',
      desc: 'Production-ready files, code, and copy — benchmarked against the highest design standards before delivery.',
    },
  ]

  return (
    <Section id="process" style={{ padding: '6rem 2.5rem' }}>
      <Eyebrow>How it works</Eyebrow>
      <h2
        data-reveal
        data-delay="1"
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: '#f0ede6',
          maxWidth: '680px',
          marginBottom: '5rem',
        }}
      >
        Three steps from brief{' '}
        <em style={{ fontStyle: 'italic' }}>to shipped.</em>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {steps.map((s, i) => (
          <div
            key={i}
            data-reveal
            data-delay={String(i + 1)}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              gap: '2rem',
              padding: '2.5rem 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1rem',
                color: '#c9a96e',
                paddingTop: '0.125rem',
                letterSpacing: '0.04em',
              }}
            >
              {s.n}
            </span>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.75rem',
                  fontWeight: 400,
                  color: '#f0ede6',
                  marginBottom: '0.75rem',
                  lineHeight: 1.2,
                }}
              >
                {s.label}
              </h3>
              <p style={{ color: '#8a8780', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: '520px' }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 6 — FREE AUDIT
═══════════════════════════════════════════════════════════ */
function AuditSection() {
  return (
    <section
      id="audit"
      style={{
        position: 'relative',
        padding: '8rem 2.5rem',
        overflow: 'hidden',
        background: '#131613',
      }}
    >
      {/* Gold radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Eyebrow>Free site audit</Eyebrow>
          <h2
            data-reveal
            data-delay="1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.75rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: '#f0ede6',
              marginBottom: '1.25rem',
            }}
          >
            Start with a free site audit.
          </h2>
          <p
            data-reveal
            data-delay="2"
            style={{ color: '#8a8780', fontSize: '1.0625rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}
          >
            Submit your URL and receive a detailed audit of your site&rsquo;s design, performance,
            and conversion potential — at no cost.
          </p>
        </div>

        <div data-reveal data-delay="3">
          <AuditForm />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCENE 7 — FOOTER
═══════════════════════════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '4rem 2.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '4rem',
        }}
      >
        {/* Brand */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.25rem',
              fontWeight: 400,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#f0ede6',
              marginBottom: '0.75rem',
            }}
          >
            CYNTHIA
          </p>
          <p style={{ color: '#5a5855', fontSize: '0.875rem', maxWidth: '260px', lineHeight: 1.6 }}>
            Autonomous Design Studio. World-class standards. Visible execution.
          </p>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div>
            <p
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#5a5855',
                marginBottom: '1rem',
              }}
            >
              Studio
            </p>
            {['Work', 'Process', 'About'].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{
                  display: 'block',
                  color: '#8a8780',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  marginBottom: '0.625rem',
                  transition: 'color 200ms ease',
                }}
              >
                {l}
              </a>
            ))}
          </div>
          <div>
            <p
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#5a5855',
                marginBottom: '1rem',
              }}
            >
              Start
            </p>
            <a
              href="#audit"
              style={{
                display: 'block',
                color: '#c9a96e',
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginBottom: '0.625rem',
              }}
            >
              Free Site Audit
            </a>
          </div>
        </nav>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <p style={{ color: '#5a5855', fontSize: '0.8125rem' }}>
          &copy; {year} Cynthia Design Studio. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy', 'Terms'].map((l) => (
            <a
              key={l}
              href={`/${l.toLowerCase()}`}
              style={{ color: '#5a5855', textDecoration: 'none', fontSize: '0.8125rem' }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <main>
        <Hero />
        <Divider />
        <Pain />
        <Divider />
        <Positioning />
        <Divider />
        <Capabilities />
        <Divider />
        <Process />
        <AuditSection />
      </main>
      <Footer />
    </>
  )
}
