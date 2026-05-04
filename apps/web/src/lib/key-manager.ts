const STORAGE_KEY = 'synthia_provider_keys'

export interface ProviderDef {
  id: string
  label: string
  placeholder: string
  docs: string
  required: boolean
}

export const PROVIDERS: ProviderDef[] = [
  { id: 'muapi', label: 'Synthia™ Studio (muapi)', placeholder: 'muapi-...', docs: 'https://muapi.ai', required: true },
  { id: 'openai', label: 'OpenAI (ChatGPT / GPT-4o)', placeholder: 'sk-...', docs: 'https://platform.openai.com/api-keys', required: false },
  { id: 'anthropic', label: 'Anthropic (Claude)', placeholder: 'sk-ant-...', docs: 'https://console.anthropic.com', required: false },
  { id: 'google', label: 'Google (Gemini)', placeholder: 'AIza...', docs: 'https://aistudio.google.com', required: false },
  { id: 'elevenlabs', label: 'ElevenLabs (Voz / Voice)', placeholder: 'el-...', docs: 'https://elevenlabs.io', required: false },
]

function load(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveKey(provider: string, key: string): void {
  const current = load()
  current[provider] = key
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

export function getKey(provider: string): string | null {
  return load()[provider] || null
}

export function getAllKeys(): Record<string, string> {
  return load()
}

export function removeKey(provider: string): void {
  const current = load()
  delete current[provider]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

export function hasRequiredKeys(): boolean {
  return !!getKey('muapi')
}
