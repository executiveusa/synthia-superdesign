/**
 * Synthia™ Brand Identity & White-Label Configuration
 *
 * Core brand constants and environment-driven white-label overrides.
 * Zero code changes per deployment — all configuration via environment variables.
 */

export const BRAND = {
  name: 'Synthia™',
  tagline_es: 'Tu IA. Tu datos. Tu negocio.',
  tagline_en: 'Your AI. Your data. Your business.',
  tagline_pt: 'Sua IA. Seus dados. Seu negócio.',
  mission: 'Sovereign Personal AI Platform for Latin America',
  operator: 'Kupuri Media™',
  parent: 'The Pauli Effect™',
  pledge: '2% of all revenue funds ecological projects + AI literacy in LATAM',

  // Visual identity
  colors: {
    primary: '#c4963c',      // Gold
    secondary: '#5a7a52',    // Sage green
    dark: '#0a1108',         // Near-black
    cream: '#f5f0e8',        // Cream/off-white
  },

  // Social & legal
  support_url: 'https://synthia.ai/support',
  privacy_url: 'https://synthia.ai/privacy',
  terms_url: 'https://synthia.ai/terms',
  pledge_transparency: 'https://synthia.ai/pledge',

  // Platform
  version: '1.0.0',
  launch_date: '2026-05-02',
  target_regions: ['LATAM', 'Spain', 'Portugal'],
  languages: ['es', 'en', 'pt'],
} as const;

/**
 * White-Label Configuration
 *
 * All values read from environment variables at startup.
 * Enables infinite white-label deployments with zero code changes.
 *
 * Example: .env.whitelabel
 * ```
 * WL_BRAND_NAME="Synthia™ Colombia"
 * WL_TAGLINE="Prepara tu negocio con IA soberana"
 * WL_PRIMARY_COLOR="#c4963c"
 * WL_NICHE="ecommerce"
 * WL_COUNTRY="CO"
 * ```
 */
export const WHITELABEL = {
  // Brand override
  name: process.env.WL_BRAND_NAME || BRAND.name,
  tagline: process.env.WL_TAGLINE || BRAND.tagline_es,
  logo_url: process.env.WL_LOGO_URL || '',

  // Visual override
  primary_color: process.env.WL_PRIMARY_COLOR || BRAND.colors.primary,
  secondary_color: process.env.WL_SECONDARY_COLOR || BRAND.colors.secondary,
  dark_color: process.env.WL_DARK_COLOR || BRAND.colors.dark,

  // Language & localization
  language: (process.env.WL_LANGUAGE || 'es') as 'es' | 'en' | 'pt',
  country: process.env.WL_COUNTRY || 'LATAM',
  timezone: process.env.WL_TIMEZONE || 'America/New_York',

  // Niche/vertical focus
  niche: process.env.WL_NICHE || 'general',  // ecommerce, saas, agency, creator, corporate, nonprofit
  operator_id: process.env.WL_OPERATOR_ID || 'kupuri-media',

  // Payment integration
  creem_api_key: process.env.CREEM_API_KEY || '',
  creem_webhook_secret: process.env.CREEM_WEBHOOK_SECRET || '',
  creem_product_id: process.env.CREEM_PRODUCT_ID || '',

  // Infrastructure
  supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // Media generation (muapi.ai)
  muapi_api_key: process.env.MUAPI_API_KEY || '',

  // Features (all optional, all white-label configurable)
  features: {
    second_brain: process.env.WL_FEATURE_SECOND_BRAIN !== 'false',
    chat_interface: process.env.WL_FEATURE_CHAT !== 'false',
    portfolio: process.env.WL_FEATURE_PORTFOLIO !== 'false',
    media_generation: process.env.WL_FEATURE_MEDIA !== 'false',
    community: process.env.WL_FEATURE_COMMUNITY !== 'false',
    byot: process.env.WL_FEATURE_BYOT !== 'false',  // Bring Your Own Tools
  },
} as const;

/**
 * Get localized brand tagline
 */
export function getBrandTagline(lang: 'es' | 'en' | 'pt' = 'es'): string {
  if (WHITELABEL.language === lang) {
    return WHITELABEL.tagline;
  }

  const taglines: Record<string, string> = {
    es: BRAND.tagline_es,
    en: BRAND.tagline_en,
    pt: BRAND.tagline_pt,
  };

  return taglines[lang] || BRAND.tagline_en;
}

/**
 * Get current color theme
 */
export function getColorTheme() {
  return {
    primary: WHITELABEL.primary_color,
    secondary: WHITELABEL.secondary_color,
    dark: WHITELABEL.dark_color,
    cream: BRAND.colors.cream,
  };
}

/**
 * Feature flags with white-label overrides
 */
export function isFeatureEnabled(feature: keyof typeof WHITELABEL.features): boolean {
  return WHITELABEL.features[feature];
}
