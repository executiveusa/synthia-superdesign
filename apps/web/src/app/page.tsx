import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav">
        <Link className="synthia-brand" href="/">
          <span className="synthia-brand-mark">S</span><span>SYNTHIA</span>
        </Link>
        <div className="landing-nav-actions">
          <Link href="/pricing" className="synthia-quiet-link">Pricing</Link>
          <Link href="/chat" className="landing-nav-cta">Open Synthia</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <span className="synthia-eyebrow">SOVEREIGN AI STUDIO</span>
        <h1>Decide the outcome.<br/><em>Synthia handles the machine.</em></h1>
        <p>One conversation coordinates your creative tools, models, memory and workflows. You direct the result. The complexity stays underneath.</p>
        <div className="landing-actions">
          <Link href="/chat" className="landing-primary">Tell Synthia what you want <span>→</span></Link>
          <Link href="/brain" className="landing-secondary">Explore your second brain</Link>
        </div>
        <div className="landing-trust">
          <span>200+ AI models</span><span>Private context</span><span>Your data stays yours</span>
        </div>
      </section>

      <section className="landing-orbit" aria-label="Synthia workflow">
        <div className="landing-orbit-ring landing-orbit-ring--one" />
        <div className="landing-orbit-ring landing-orbit-ring--two" />
        <div className="landing-orbit-core"><strong>You</strong><small>Outcome</small></div>
        <div className="landing-orbit-node landing-orbit-node--a"><strong>Synthia</strong><small>Orchestrates</small></div>
        <div className="landing-orbit-node landing-orbit-node--b"><strong>Context</strong><small>Remembers</small></div>
        <div className="landing-orbit-node landing-orbit-node--c"><strong>Tools</strong><small>Create</small></div>
      </section>

      <section className="landing-principle">
        <span>THE INTERFACE GETS SMALLER AS THE SYSTEM GETS STRONGER.</span>
      </section>
    </main>
  )
}