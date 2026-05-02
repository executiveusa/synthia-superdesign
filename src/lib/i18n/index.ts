/**
 * Synthia™ Internationalization (i18n) System
 *
 * Spanish-first translations with English and Portuguese fallback.
 * All UI strings centralized and versioned.
 *
 * Usage:
 * ```
 * import { t } from '@/lib/i18n';
 * const greeting = t('nav.welcome', 'es');  // "Bienvenido"
 * ```
 */

export type Language = 'es' | 'en' | 'pt';

export const TRANSLATIONS = {
  // Navigation
  'nav.welcome': {
    es: 'Bienvenido',
    en: 'Welcome',
    pt: 'Bem-vindo',
  },
  'nav.home': {
    es: 'Inicio',
    en: 'Home',
    pt: 'Início',
  },
  'nav.studio': {
    es: 'Studio',
    en: 'Studio',
    pt: 'Studio',
  },
  'nav.brain': {
    es: 'Segunda Mente',
    en: 'Second Brain',
    pt: 'Segundo Cérebro',
  },
  'nav.portfolio': {
    es: 'Portafolio',
    en: 'Portfolio',
    pt: 'Portfólio',
  },
  'nav.settings': {
    es: 'Configuración',
    en: 'Settings',
    pt: 'Configurações',
  },
  'nav.help': {
    es: 'Ayuda',
    en: 'Help',
    pt: 'Ajuda',
  },

  // Hero Section
  'hero.tagline': {
    es: 'Tu IA. Tu datos. Tu negocio.',
    en: 'Your AI. Your data. Your business.',
    pt: 'Sua IA. Seus dados. Seu negócio.',
  },
  'hero.description': {
    es: 'Synthia™ es tu asistente IA soberano. Trae tus propias herramientas. Posee tus datos. Sin suscripción recurrente.',
    en: 'Synthia™ is your sovereign AI assistant. Bring your own tools. Own your data. No recurring fees.',
    pt: 'Synthia™ é seu assistente IA soberano. Traga suas próprias ferramentas. Possua seus dados. Sem taxas recorrentes.',
  },
  'hero.cta_primary': {
    es: 'Empezar gratis',
    en: 'Get started free',
    pt: 'Comece gratuitamente',
  },
  'hero.cta_secondary': {
    es: 'Ver templates',
    en: 'Browse templates',
    pt: 'Ver modelos',
  },

  // Features
  'feature.sovereignty': {
    es: 'Soberanía de Datos',
    en: 'Data Sovereignty',
    pt: 'Soberania de Dados',
  },
  'feature.sovereignty.desc': {
    es: 'Tus datos nunca salen de tu dispositivo. Importa desde ChatGPT, Claude, Notion. Exporta cuando quieras.',
    en: 'Your data never leaves your device. Import from ChatGPT, Claude, Notion. Export anytime.',
    pt: 'Seus dados nunca saem do seu dispositivo. Importe de ChatGPT, Claude, Notion. Exporte quando quiser.',
  },

  'feature.byot': {
    es: 'Trae Tus Propias Herramientas',
    en: 'Bring Your Own Tools',
    pt: 'Traga Suas Próprias Ferramentas',
  },
  'feature.byot.desc': {
    es: 'Conecta OpenAI, Anthropic, Google, ElevenLabs, Suno. Tus claves API se guardan localmente. Nunca las tocamos.',
    en: 'Connect OpenAI, Anthropic, Google, ElevenLabs, Suno. Your API keys stay local. We never touch them.',
    pt: 'Conecte OpenAI, Anthropic, Google, ElevenLabs, Suno. Suas chaves API ficam locais. Nunca as tocamos.',
  },

  'feature.models': {
    es: '200+ Modelos de IA',
    en: '200+ AI Models',
    pt: '200+ Modelos de IA',
  },
  'feature.models.desc': {
    es: 'Acceso a GPT-4, Claude 3, Gemini, Mistral, Stable Diffusion, Runway, y más via muapi.ai',
    en: 'Access GPT-4, Claude 3, Gemini, Mistral, Stable Diffusion, Runway, and more via muapi.ai',
    pt: 'Acesso a GPT-4, Claude 3, Gemini, Mistral, Stable Diffusion, Runway e mais via muapi.ai',
  },

  'feature.secondbrain': {
    es: 'Segunda Mente',
    en: 'Second Brain',
    pt: 'Segundo Cérebro',
  },
  'feature.secondbrain.desc': {
    es: 'Knowledge graph personal en IndexedDB. Busca, organiza, recupera tu contexto. Compartible por enlace.',
    en: 'Personal knowledge graph in IndexedDB. Search, organize, retrieve your context. Shareable by link.',
    pt: 'Gráfico de conhecimento pessoal em IndexedDB. Pesquise, organize, recupere seu contexto. Compartilhável por link.',
  },

  // Onboarding
  'onboarding.import': {
    es: 'Importar Datos',
    en: 'Import Data',
    pt: 'Importar Dados',
  },
  'onboarding.import.description': {
    es: 'Importa tus conversaciones de ChatGPT, Claude o Notion. Tus datos se guardan localmente.',
    en: 'Import your conversations from ChatGPT, Claude, or Notion. Your data stays local.',
    pt: 'Importe suas conversas de ChatGPT, Claude ou Notion. Seus dados ficam locais.',
  },

  'onboarding.tools': {
    es: 'Conectar Herramientas',
    en: 'Connect Tools',
    pt: 'Conectar Ferramentas',
  },
  'onboarding.tools.description': {
    es: 'Añade tus claves API de OpenAI, Google, ElevenLabs, etc. Nos puedes confiar con ellas aquí.',
    en: 'Add your API keys from OpenAI, Google, ElevenLabs, etc. Safe & encrypted locally.',
    pt: 'Adicione suas chaves API do OpenAI, Google, ElevenLabs, etc. Seguras e criptografadas localmente.',
  },

  'onboarding.studio': {
    es: 'Explorar Studio',
    en: 'Explore Studio',
    pt: 'Explorar Studio',
  },

  // Pricing
  'pricing.title': {
    es: 'Planes Simples',
    en: 'Simple Plans',
    pt: 'Planos Simples',
  },
  'pricing.subtitle': {
    es: 'Sin suscripciones recurrentes. Pago único, acceso de por vida.',
    en: 'No recurring subscriptions. One-time payment, lifetime access.',
    pt: 'Sem assinaturas recorrentes. Pagamento único, acesso vitalício.',
  },

  'pricing.starter': {
    es: 'Iniciador',
    en: 'Starter',
    pt: 'Iniciador',
  },
  'pricing.professional': {
    es: 'Profesional',
    en: 'Professional',
    pt: 'Profissional',
  },
  'pricing.operator': {
    es: 'Operador',
    en: 'Operator',
    pt: 'Operador',
  },

  'pricing.per_purchase': {
    es: 'Pago único',
    en: 'One-time payment',
    pt: 'Pagamento único',
  },

  'pricing.cta': {
    es: 'Comprar ahora',
    en: 'Buy now',
    pt: 'Comprar agora',
  },

  // Pledge
  'pledge.title': {
    es: '2% Por el Planeta',
    en: '2% for the Planet',
    pt: '2% Pelo Planeta',
  },
  'pledge.description': {
    es: 'El 2% de cada compra financia proyectos ecológicos y educación en IA en América Latina.',
    en: '2% of every purchase funds ecological projects and AI education in Latin America.',
    pt: '2% de cada compra financia projetos ecológicos e educação em IA na América Latina.',
  },
  'pledge.link': {
    es: 'Ver transparencia',
    en: 'View transparency',
    pt: 'Ver transparência',
  },

  // Footer
  'footer.copyright': {
    es: '© 2026 Synthia™ por Kupuri Media. Todos los derechos reservados.',
    en: '© 2026 Synthia™ by Kupuri Media. All rights reserved.',
    pt: '© 2026 Synthia™ por Kupuri Media. Todos os direitos reservados.',
  },
  'footer.privacy': {
    es: 'Privacidad',
    en: 'Privacy',
    pt: 'Privacidade',
  },
  'footer.terms': {
    es: 'Términos',
    en: 'Terms',
    pt: 'Termos',
  },
  'footer.status': {
    es: 'Estado',
    en: 'Status',
    pt: 'Status',
  },

  // Errors
  'error.generic': {
    es: 'Algo salió mal. Por favor intenta de nuevo.',
    en: 'Something went wrong. Please try again.',
    pt: 'Algo deu errado. Por favor tente novamente.',
  },
  'error.network': {
    es: 'Error de conexión. Verifica tu internet.',
    en: 'Connection error. Check your internet.',
    pt: 'Erro de conexão. Verifique sua internet.',
  },
  'error.auth': {
    es: 'No autenticado. Por favor inicia sesión.',
    en: 'Not authenticated. Please sign in.',
    pt: 'Não autenticado. Por favor, faça login.',
  },

  // Success
  'success.saved': {
    es: 'Guardado correctamente',
    en: 'Saved successfully',
    pt: 'Salvo com sucesso',
  },
  'success.imported': {
    es: 'Datos importados correctamente',
    en: 'Data imported successfully',
    pt: 'Dados importados com sucesso',
  },
} as const;

/**
 * Get translated string
 * Falls back to English if key not found
 */
export function t(key: keyof typeof TRANSLATIONS, language: Language = 'es'): string {
  const translations = TRANSLATIONS[key];
  if (!translations) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }

  return translations[language] || translations.en || key;
}

/**
 * Get all translations for a language
 */
export function getAllTranslations(language: Language): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, translations] of Object.entries(TRANSLATIONS)) {
    result[key] = translations[language as Language] || translations.en || key;
  }

  return result;
}

/**
 * Plural support
 */
export function tp(
  singular: string,
  plural: string,
  count: number,
  language: Language = 'es'
): string {
  return count === 1 ? singular : plural;
}
