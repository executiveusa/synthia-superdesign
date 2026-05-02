/**
 * Synthia™ Product Catalog
 *
 * Three tiers: Starter, Professional, Operator
 * All are one-time payments (no recurring fees).
 * 2% of revenue automatically pledged to LATAM eco + AI literacy.
 *
 * Pricing optimized for Latin America purchasing power
 * (USD prices; can be localized via WHITELABEL)
 */

export interface SynthiaProduct {
  id: string;
  creem_product_id: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  price_usd: number;
  price_currency: string;
  tier: 'starter' | 'professional' | 'operator';
  features_es: string[];
  features_en: string[];
  max_users?: number;
  max_projects?: number;
  api_calls_monthly?: number;
  support_tier?: 'email' | 'priority' | 'dedicated';
  included_models?: number;
}

export const PRODUCTS: Record<string, SynthiaProduct> = {
  starter: {
    id: 'synthia-starter',
    creem_product_id: process.env.CREEM_STARTER_ID || 'starter-001',
    name_es: 'Iniciador',
    name_en: 'Starter',
    description_es: 'Para crear con IA. Sin límites de datos.',
    description_en: 'Build with AI. Unlimited data sovereignty.',
    price_usd: 97,
    price_currency: 'USD',
    tier: 'starter',
    features_es: [
      'Acceso de por vida a Synthia™ Studio',
      'Almacenamiento ilimitado en Second Brain (IndexedDB)',
      'Importa tus datos de ChatGPT, Claude, Notion',
      'Acceso a 200+ modelos de IA vía muapi.ai',
      'Generación de imágenes básica',
      'Chat ilimitado (usa tus propias claves API)',
      'Exporta y respalda tu contexto cuando quieras',
      'Sin suscripción recurrente',
      'Tu información nunca toca nuestros servidores',
    ],
    features_en: [
      'Lifetime access to Synthia™ Studio',
      'Unlimited Second Brain storage (IndexedDB)',
      'Import your data from ChatGPT, Claude, Notion',
      'Access 200+ AI models via muapi.ai',
      'Basic image generation',
      'Unlimited chat (use your own API keys)',
      'Export and backup your context anytime',
      'No recurring subscription',
      'Your data never touches our servers',
    ],
    max_users: 1,
    max_projects: 50,
    api_calls_monthly: 100_000,
    support_tier: 'email',
    included_models: 200,
  },

  professional: {
    id: 'synthia-professional',
    creem_product_id: process.env.CREEM_PROFESSIONAL_ID || 'professional-001',
    name_es: 'Profesional',
    name_en: 'Professional',
    description_es: 'Para agencias y equipos. Verdadera colaboración.',
    description_en: 'For agencies & teams. True collaboration.',
    price_usd: 297,
    price_currency: 'USD',
    tier: 'professional',
    features_es: [
      'Todo en Iniciador +',
      'Hasta 5 usuarios en tu workspace',
      'Portafolio comunitario: synthia.ai/u/[tu-nombre]',
      'Generación de video (hasta 1080p)',
      'Remix y ciclos de crecimiento viral',
      'Integración con Zapier (automatizaciones)',
      'API REST para tu flujo de trabajo',
      'Soporte prioritario por correo',
      'Análisis de uso y estadísticas',
      'Templates premium para 12 sectores',
      'Sin suscripción recurrente',
    ],
    features_en: [
      'Everything in Starter +',
      'Up to 5 users in your workspace',
      'Community portfolio: synthia.ai/u/[your-name]',
      'Video generation (up to 1080p)',
      'Remix & viral growth loops',
      'Zapier integration (automations)',
      'REST API for your workflow',
      'Priority email support',
      'Usage analytics & insights',
      'Premium templates for 12 industries',
      'No recurring subscription',
    ],
    max_users: 5,
    max_projects: 500,
    api_calls_monthly: 1_000_000,
    support_tier: 'priority',
    included_models: 200,
  },

  operator: {
    id: 'synthia-operator',
    creem_product_id: process.env.CREEM_OPERATOR_ID || 'operator-001',
    name_es: 'Operador',
    name_en: 'Operator',
    description_es: 'Para fundadores. Despliegue sin límites.',
    description_en: 'For founders. Unlimited deployments.',
    price_usd: 497,
    price_currency: 'USD',
    tier: 'operator',
    features_es: [
      'Todo en Profesional +',
      'Hasta 100 usuarios',
      'White-label ilimitado (tu marca, tus dominios)',
      'Generación de video 4K con cinema mode',
      'Síntesis de audio + lip-sync',
      'Integración con Creem.io para monetizar',
      'Webhooks y eventos en tiempo real',
      'Soporte dedicado (Slack/WhatsApp)',
      'Acceso a modelos en beta y exclusivos',
      'Descuento del 10% en servicios premium',
      'Documentación de API completa',
      'Garantía de 99.9% uptime',
      'Sin suscripción recurrente',
      'Licencia perpetua para despliegues',
    ],
    features_en: [
      'Everything in Professional +',
      'Up to 100 users',
      'Unlimited white-label (your brand, your domains)',
      '4K video generation with cinema mode',
      'Audio synthesis + lip-sync',
      'Creem.io integration to monetize',
      'Webhooks & real-time events',
      'Dedicated support (Slack/WhatsApp)',
      'Access to beta & exclusive models',
      '10% discount on premium services',
      'Complete API documentation',
      '99.9% uptime guarantee',
      'No recurring subscription',
      'Perpetual license for deployments',
    ],
    max_users: 100,
    max_projects: Infinity,
    api_calls_monthly: 100_000_000,
    support_tier: 'dedicated',
    included_models: 200,
  },
};

/**
 * Get product by ID
 */
export function getProduct(id: string): SynthiaProduct | null {
  return PRODUCTS[id] || null;
}

/**
 * Get all products
 */
export function getAllProducts(): SynthiaProduct[] {
  return Object.values(PRODUCTS);
}

/**
 * Get checkout URL for Creem.io
 * User will be redirected to Creem.io payment page
 */
export function getCreemCheckoutUrl(
  productId: string,
  userEmail: string,
  language: 'es' | 'en' = 'es'
): string {
  const product = getProduct(productId);
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  const params = new URLSearchParams({
    product_id: product.creem_product_id,
    email: userEmail,
    language,
    return_url: `${window.location.origin}/checkout/success`,
  });

  return `https://checkout.creem.io?${params.toString()}`;
}

/**
 * Calculate 2% pledge amount (goes to LATAM eco + AI literacy fund)
 */
export function calculatePledgeAmount(price: number): number {
  return Math.round(price * 0.02 * 100) / 100;
}

/**
 * Get pledge breakdown
 */
export function getPledgeBreakdown(productId: string): {
  product_name: string;
  product_price: number;
  pledge_amount: number;
  your_cost: number;
  description: string;
} | null {
  const product = getProduct(productId);
  if (!product) return null;

  const pledgeAmount = calculatePledgeAmount(product.price_usd);

  return {
    product_name: product.name_en,
    product_price: product.price_usd,
    pledge_amount: pledgeAmount,
    your_cost: product.price_usd,
    description: `When you buy ${product.name_en}, $${pledgeAmount.toFixed(2)} automatically supports ecological restoration + AI education programs in Latin America.`,
  };
}
