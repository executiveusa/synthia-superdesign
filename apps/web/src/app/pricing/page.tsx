import { PRODUCTS } from '@/lib/creem/products'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#5a7a52" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="#5a7a52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-dark)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', color: 'var(--color-primary)' }}>S</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-muted)', letterSpacing: '0.15em' }}>SYNTHIA™</span>
        </a>
        <a href="/chat" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'var(--color-dark)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 700 }}>
          Entrar →
        </a>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'var(--color-text)', marginBottom: '1rem' }}>
          Un pago. Para siempre.
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto' }}>
          Sin suscripción. Sin sorpresas. Tus datos son tuyos.
        </p>
      </section>

      {/* Cards */}
      <section style={{ padding: '0 1.5rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {PRODUCTS.map(product => (
            <div key={product.id} style={{
              background: product.highlighted ? 'var(--color-surface)' : 'var(--color-dark)',
              border: `1px solid ${product.highlighted ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '16px',
              padding: '2rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {product.highlighted && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: 'var(--color-dark)', padding: '0.25rem 0.875rem', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', fontWeight: 700 }}>
                  MÁS POPULAR
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{product.name_es}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>{product.description_es}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>${product.price_usd}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginLeft: '0.375rem' }}>USD</span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1, marginBottom: '1.5rem' }}>
                {product.features_es.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                    <span style={{ flexShrink: 0, marginTop: '1px' }}><CheckIcon /></span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={`https://www.creem.io/payment/${product.creem_product_id || 'synthia'}`}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.875rem',
                  background: product.highlighted ? 'var(--color-primary)' : 'transparent',
                  color: product.highlighted ? 'var(--color-dark)' : 'var(--color-primary)',
                  border: `1px solid var(--color-primary)`,
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Instalar Synthia™ →
              </a>
              <div style={{ marginTop: '0.625rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                Pago único · Sin suscripción
              </div>
            </div>
          ))}
        </div>

        {/* 2% pledge banner */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(90,122,82,0.08)', border: '1px solid rgba(90,122,82,0.2)', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            🌱 <strong style={{ color: 'var(--color-text)' }}>2% de cada venta</strong> apoya proyectos eco y alfabetización IA en LATAM — automáticamente.
          </p>
        </div>
      </section>
    </div>
  )
}
