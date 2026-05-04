import type { SecondBrainEntry } from '@/lib/data-import'

const DB_NAME = 'synthia-second-brain'
const DB_VERSION = 1
const STORE_NAME = 'entries'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('source', 'source', { unique: false })
        store.createIndex('type', 'type', { unique: false })
        store.createIndex('updated_at', 'updated_at', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveEntry(entry: SecondBrainEntry): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function saveBatch(entries: SecondBrainEntry[]): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    entries.forEach(e => store.put(e))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllEntries(): Promise<SecondBrainEntry[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result as SecondBrainEntry[])
    req.onerror = () => reject(req.error)
  })
}

export async function searchEntries(query: string): Promise<SecondBrainEntry[]> {
  const all = await getAllEntries()
  const q = query.toLowerCase()
  return all.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.content.toLowerCase().includes(q) ||
    e.tags.some(t => t.toLowerCase().includes(q))
  )
}

export async function getStats(): Promise<{ total: number; sources: Record<string, number>; types: Record<string, number> }> {
  const all = await getAllEntries()
  const sources: Record<string, number> = {}
  const types: Record<string, number> = {}
  all.forEach(e => {
    sources[e.source] = (sources[e.source] || 0) + 1
    types[e.type] = (types[e.type] || 0) + 1
  })
  return { total: all.length, sources, types }
}

export async function exportAll(): Promise<string> {
  const all = await getAllEntries()
  return JSON.stringify(all, null, 2)
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
