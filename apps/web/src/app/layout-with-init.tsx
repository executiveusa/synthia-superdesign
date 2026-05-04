/**
 * Root Layout with Synthia™ Initialization
 *
 * This replaces layout.tsx and adds:
 * - Startup validation
 * - Second brain initialization
 * - Environment setup
 * - Health check on startup
 *
 * Note: This is the complete initialization pattern.
 * In production, integrate into your existing layout.tsx
 */

import { ReactNode } from 'react';
import { assertEnvironmentValid, printStartupStatus } from '@/lib/startup-check';
import { getSecondBrainStore } from '@/lib/second-brain/store';
import { BRAND, WHITELABEL } from '@/lib/identity';
import './globals.css';

// Validate environment at build/startup time
function validateOnBuild() {
  if (typeof window === 'undefined') {
    // Server-side validation
    try {
      assertEnvironmentValid();
      printStartupStatus();
    } catch (error) {
      console.error('Startup validation failed:', error);
      // In production, this should fail loudly
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }
}

// Initialize second brain at startup
async function initializeSecondBrain() {
  if (typeof window !== 'undefined') {
    try {
      const store = await getSecondBrainStore();
      const stats = await store.getStats();
      console.log(`[Synthia] Second Brain initialized: ${stats.total_entries} entries`);
    } catch (error) {
      console.error('[Synthia] Failed to initialize Second Brain:', error);
    }
  }
}

export const metadata = {
  title: `${WHITELABEL.name} - ${BRAND.tagline_en}`,
  description: BRAND.mission,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Server-side initialization
  validateOnBuild();

  return (
    <html lang={WHITELABEL.language} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content={WHITELABEL.primary_color} />
        <meta property="og:title" content={WHITELABEL.name} />
        <meta property="og:description" content={BRAND.mission} />

        {/* Google Fonts (approved fonts only - no banned fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Mono:wght@400;500&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="synthia-root" style={{ colorScheme: 'dark' }}>
        {/* Client-side initializer */}
        <SynthiaInitializer>{children}</SynthiaInitializer>

        {/* Pledge footer */}
        <PledgeFooter />
      </body>
    </html>
  );
}

/**
 * Client-side initializer component
 */
function SynthiaInitializer({ children }: { children: ReactNode }) {
  'use client';

  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        await initializeSecondBrain();
        setInitialized(true);
      } catch (error) {
        console.error('[Synthia] Initialization error:', error);
        setInitialized(true);  // Continue anyway
      }
    })();
  }, []);

  if (!initialized) {
    return <SplashScreen />;
  }

  return children;
}

/**
 * Splash/loading screen
 */
function SplashScreen() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a1108',
        color: '#c4963c',
        fontFamily: "'DM Mono', monospace",
        fontSize: '14px',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          Synthia™
        </div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>Initializing your sovereign AI platform...</div>
      </div>

      <div style={{ fontSize: '24px' }}>⏳</div>
    </div>
  );
}

/**
 * Pledge footer — shows on every page
 */
function PledgeFooter() {
  'use client';

  return (
    <footer
      style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'rgba(196, 150, 60, 0.1)',
        borderTop: '1px solid rgba(196, 150, 60, 0.2)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <p style={{ margin: 0 }}>
        2% of every purchase funds ecological restoration + AI literacy in Latin America.{' '}
        <a href="/pledge" style={{ color: '#c4963c', textDecoration: 'none' }}>
          View transparency report →
        </a>
      </p>
    </footer>
  );
}

import React from 'react';
