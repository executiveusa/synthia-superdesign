type LimitEntry = { count: number; resetAt: number }

const memory = new Map<string, LimitEntry>()

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const existing = memory.get(key)
  if (!existing || now > existing.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }
  existing.count += 1
  memory.set(key, existing)
  return { allowed: true, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt }
}
