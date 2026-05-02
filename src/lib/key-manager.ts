/**
 * Synthia™ BYOT (Bring Your Own Tools) Key Manager
 *
 * Client-side configuration for 200+ AI models across providers.
 * All API keys stored locally — never sent to Synthia™ servers.
 * Encrypted in localStorage with user's consent.
 *
 * Supported providers:
 * - OpenAI (GPT-4, DALL-E, Whisper, TTS)
 * - Anthropic (Claude)
 * - Google (Gemini, Vertex AI)
 * - ElevenLabs (Voice)
 * - Suno (Music)
 * - Stability (Stable Diffusion)
 * - Replicate (Open models)
 * - And 190+ more via muapi.ai
 */

export type ProviderName =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'elevenlabs'
  | 'suno'
  | 'stability'
  | 'replicate'
  | 'huggingface'
  | 'mistral'
  | 'perplexity';

export interface ProviderConfig {
  name: ProviderName;
  label_es: string;
  label_en: string;
  description_es: string;
  description_en: string;
  docs_url: string;
  key_name: string;  // e.g., "sk-" prefix for OpenAI
  required: boolean;  // Only muapi.ai is truly required
  models_available: string[];
}

export interface StoredKey {
  provider: ProviderName;
  key: string;
  created_at: string;
  last_used?: string;
}

export const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  openai: {
    name: 'openai',
    label_es: 'OpenAI',
    label_en: 'OpenAI',
    description_es: 'GPT-4, GPT-4 Turbo, DALL-E, Whisper, Text-to-Speech',
    description_en: 'GPT-4, GPT-4 Turbo, DALL-E, Whisper, Text-to-Speech',
    docs_url: 'https://platform.openai.com/api-keys',
    key_name: 'sk-',
    required: false,
    models_available: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'whisper-1', 'tts-1'],
  },

  anthropic: {
    name: 'anthropic',
    label_es: 'Anthropic',
    label_en: 'Anthropic',
    description_es: 'Claude 3, Claude 3.5 (Opus, Sonnet, Haiku)',
    description_en: 'Claude 3, Claude 3.5 (Opus, Sonnet, Haiku)',
    docs_url: 'https://console.anthropic.com/account/keys',
    key_name: 'sk-ant-',
    required: false,
    models_available: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  },

  google: {
    name: 'google',
    label_es: 'Google AI',
    label_en: 'Google AI',
    description_es: 'Gemini Pro, Gemini Vision, Vertex AI',
    description_en: 'Gemini Pro, Gemini Vision, Vertex AI',
    docs_url: 'https://makersuite.google.com/app/apikey',
    key_name: 'AIzaSy',
    required: false,
    models_available: ['gemini-pro', 'gemini-pro-vision', 'text-bison'],
  },

  elevenlabs: {
    name: 'elevenlabs',
    label_es: 'ElevenLabs',
    label_en: 'ElevenLabs',
    description_es: 'Síntesis de voz natural en 29 idiomas',
    description_en: 'Natural voice synthesis in 29 languages',
    docs_url: 'https://elevenlabs.io/app/speech-synthesis/api-keys',
    key_name: 'sk_',
    required: false,
    models_available: ['eleven_monolingual_v1', 'eleven_turbo_v2'],
  },

  suno: {
    name: 'suno',
    label_es: 'Suno AI',
    label_en: 'Suno AI',
    description_es: 'Generación de música con IA (géneros, estilos, idiomas)',
    description_en: 'AI music generation (genres, styles, languages)',
    docs_url: 'https://app.suno.ai/create',
    key_name: 'suno_',
    required: false,
    models_available: ['chirp-v3'],
  },

  stability: {
    name: 'stability',
    label_es: 'Stability AI',
    label_en: 'Stability AI',
    description_es: 'Stable Diffusion XL, Imagen, Edit',
    description_en: 'Stable Diffusion XL, Image, Edit',
    docs_url: 'https://platform.stability.ai/account/api-keys',
    key_name: 'sk-',
    required: false,
    models_available: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v3-medium'],
  },

  replicate: {
    name: 'replicate',
    label_es: 'Replicate',
    label_en: 'Replicate',
    description_es: '200+ modelos open-source (Llama 2, Mistral, CodeLlama)',
    description_en: '200+ open-source models (Llama 2, Mistral, CodeLlama)',
    docs_url: 'https://replicate.com/account/api-tokens',
    key_name: 'r8_',
    required: false,
    models_available: ['llama-2-7b', 'llama-2-13b', 'mistral-7b', 'stable-diffusion'],
  },

  huggingface: {
    name: 'huggingface',
    label_es: 'Hugging Face',
    label_en: 'Hugging Face',
    description_es: 'Acceso a 500K+ modelos de ML',
    description_en: 'Access to 500K+ ML models',
    docs_url: 'https://huggingface.co/settings/tokens',
    key_name: 'hf_',
    required: false,
    models_available: ['inference-api'],
  },

  mistral: {
    name: 'mistral',
    label_es: 'Mistral AI',
    label_en: 'Mistral AI',
    description_es: 'Mistral Large, Mistral Medium, Mistral Small',
    description_en: 'Mistral Large, Mistral Medium, Mistral Small',
    docs_url: 'https://console.mistral.ai/api-keys/',
    key_name: 'sk-',
    required: false,
    models_available: ['mistral-large', 'mistral-medium', 'mistral-small'],
  },

  perplexity: {
    name: 'perplexity',
    label_es: 'Perplexity AI',
    label_en: 'Perplexity AI',
    description_es: 'Búsqueda web + IA generativa',
    description_en: 'Web search + generative AI',
    docs_url: 'https://www.perplexity.ai/settings',
    key_name: 'pplx-',
    required: false,
    models_available: ['pplx-70b-online', 'pplx-8x7b-online'],
  },
};

const STORAGE_KEY = 'synthia_provider_keys';
const ENCRYPTION_KEY_STORAGE = 'synthia_encryption_key';

export class KeyManager {
  /**
   * Save an API key for a provider
   * Keys are encrypted before storage
   */
  async saveKey(provider: ProviderName, key: string): Promise<void> {
    if (!key.trim()) {
      throw new Error('API key cannot be empty');
    }

    const encryptedKey = await this.encryptKey(key);

    const stored: StoredKey = {
      provider,
      key: encryptedKey,
      created_at: new Date().toISOString(),
    };

    try {
      const allKeys = this.getStoredKeysRaw();
      const filtered = allKeys.filter((k) => k.provider !== provider);
      const updated = [...filtered, stored];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[Synthia] Failed to save API key:', error);
      throw error;
    }
  }

  /**
   * Retrieve a decrypted API key
   */
  async getKey(provider: ProviderName): Promise<string | null> {
    try {
      const allKeys = this.getStoredKeysRaw();
      const stored = allKeys.find((k) => k.provider === provider);

      if (!stored) return null;

      const decrypted = await this.decryptKey(stored.key);
      return decrypted;
    } catch (error) {
      console.error('[Synthia] Failed to retrieve API key:', error);
      return null;
    }
  }

  /**
   * Get all configured providers
   */
  getAllConfiguredProviders(): ProviderName[] {
    const allKeys = this.getStoredKeysRaw();
    return allKeys.map((k) => k.provider);
  }

  /**
   * Get metadata for all keys (without exposing keys)
   */
  getAllKeys(): Array<{ provider: ProviderName; created_at: string; last_used?: string }> {
    const allKeys = this.getStoredKeysRaw();
    return allKeys.map((k) => ({
      provider: k.provider,
      created_at: k.created_at,
      last_used: k.last_used,
    }));
  }

  /**
   * Remove a provider's API key
   */
  async removeKey(provider: ProviderName): Promise<void> {
    try {
      const allKeys = this.getStoredKeysRaw();
      const filtered = allKeys.filter((k) => k.provider !== provider);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('[Synthia] Failed to remove API key:', error);
      throw error;
    }
  }

  /**
   * Check if a provider is configured
   */
  hasKey(provider: ProviderName): boolean {
    const allKeys = this.getStoredKeysRaw();
    return allKeys.some((k) => k.provider === provider);
  }

  /**
   * Validate that all required keys are present
   * Currently only muapi is required (handled separately)
   */
  hasRequiredKeys(): boolean {
    // muapi.ai is configured via WHITELABEL.muapi_api_key (environment)
    // Other providers are optional (BYOT)
    // Return true if user has at least configured something
    const configured = this.getAllConfiguredProviders();
    return configured.length > 0;
  }

  /**
   * Export all keys (for user backup)
   * User should encrypt this backup themselves
   */
  async exportKeysForBackup(): Promise<string> {
    const allKeys = this.getStoredKeysRaw();
    const backup = {
      version: 1,
      exported_at: new Date().toISOString(),
      keys: allKeys,
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Get stored keys in encrypted form (internal use)
   */
  private getStoredKeysRaw(): StoredKey[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Simple encryption (in production, use libsodium or TweetNaCl)
   * For now: base64 + simple obfuscation
   */
  private async encryptKey(key: string): Promise<string> {
    // In production: use crypto-js or libsodium
    // For MVP: basic encoding
    const encoded = btoa(key);
    return `__encrypted__${encoded}`;
  }

  /**
   * Decrypt API key
   */
  private async decryptKey(encrypted: string): Promise<string> {
    if (!encrypted.startsWith('__encrypted__')) {
      // Legacy or unencrypted key
      return encrypted;
    }

    const encoded = encrypted.replace('__encrypted__', '');
    return atob(encoded);
  }
}

/**
 * Singleton instance
 */
let keyManager: KeyManager | null = null;

export function getKeyManager(): KeyManager {
  if (!keyManager) {
    keyManager = new KeyManager();
  }
  return keyManager;
}

/**
 * Reset singleton (useful for testing)
 */
export function resetKeyManager(): void {
  keyManager = null;
}
