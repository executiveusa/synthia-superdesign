import { loadEncryptedKeys, saveEncryptedKeys } from '@/lib/crypto-keys'

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

let masterPassword = 'synthia-default-master-password'
let cache: Record<string, string> | null = null

export function setMasterPassword(password: string): void {
  masterPassword = password
  cache = null
}

async function load(): Promise<Record<string, string>> {
  if (cache) return cache
  cache = await loadEncryptedKeys(masterPassword)
  return cache
}

export async function saveKey(provider: string, key: string): Promise<void> {
  const current = await load()
  current[provider] = key
  cache = current
  await saveEncryptedKeys(current, masterPassword)
}

export async function getKey(provider: string): Promise<string | null> {
  const keys = await load()
  return keys[provider] || null
}

export async function getAllKeys(): Promise<Record<string, string>> {
  return load()
}

export async function removeKey(provider: string): Promise<void> {
  const current = await load()
  delete current[provider]
  cache = current
  await saveEncryptedKeys(current, masterPassword)
}

export async function hasRequiredKeys(): Promise<boolean> {
  return !!(await getKey('muapi'))
}
