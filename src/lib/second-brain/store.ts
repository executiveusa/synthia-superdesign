/**
 * Synthia™ Second Brain Store
 *
 * IndexedDB-backed personal knowledge graph.
 * Local-first. Sovereign. Never syncs unless explicitly enabled.
 *
 * Searchable by title, content, tags.
 * Supports full exports and reimports.
 */

import type { SecondBrainEntry } from '../data-import/index';

const DB_NAME = 'synthia-second-brain';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

interface SecondBrainStats {
  total_entries: number;
  total_bytes: number;
  oldest_entry: string | null;
  newest_entry: string | null;
  tags_count: Record<string, number>;
}

export class SecondBrainStore {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the database (call on app startup)
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

          // Create indexes for fast searching
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          store.createIndex('created_at', 'created_at', { unique: false });
          store.createIndex('updated_at', 'updated_at', { unique: false });
          store.createIndex('source', 'source', { unique: false });
        }
      };
    });
  }

  /**
   * Save or update an entry
   */
  async saveEntry(entry: SecondBrainEntry): Promise<void> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        ...entry,
        updated_at: new Date().toISOString(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Save multiple entries in batch
   */
  async saveEntries(entries: SecondBrainEntry[]): Promise<void> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      entries.forEach((entry) => {
        store.put({
          ...entry,
          updated_at: new Date().toISOString(),
        });
      });

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  /**
   * Get all entries
   */
  async getAllEntries(): Promise<SecondBrainEntry[]> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get entry by ID
   */
  async getEntry(id: string): Promise<SecondBrainEntry | null> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Search entries by full-text content
   */
  async searchEntries(query: string, limit: number = 50): Promise<SecondBrainEntry[]> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    const allEntries = await this.getAllEntries();
    const queryLower = query.toLowerCase();

    return allEntries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(queryLower) ||
          entry.content.toLowerCase().includes(queryLower) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, limit);
  }

  /**
   * Get entries by tag
   */
  async getEntriesByTag(tag: string): Promise<SecondBrainEntry[]> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('tags');
      const request = index.getAll(tag);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get entries by source (conversation, manual, imported)
   */
  async getEntriesBySource(source: string): Promise<SecondBrainEntry[]> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('source');
      const request = index.getAll(source);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Delete an entry
   */
  async deleteEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear all entries (be careful!)
   */
  async clear(): Promise<void> {
    if (!this.db) throw new Error('Second Brain Store not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Export second brain as JSON (user can download/backup)
   */
  async exportSecondBrain(): Promise<string> {
    const entries = await this.getAllEntries();
    const exportData = {
      version: 1,
      exported_at: new Date().toISOString(),
      entry_count: entries.length,
      entries,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get statistics about the second brain
   */
  async getStats(): Promise<SecondBrainStats> {
    const entries = await this.getAllEntries();

    const tagCounts: Record<string, number> = {};
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const totalBytes = entries.reduce((sum, entry) => {
      return sum + new Blob([JSON.stringify(entry)]).size;
    }, 0);

    const sortedByDate = [...entries].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return {
      total_entries: entries.length,
      total_bytes: totalBytes,
      oldest_entry: sortedByDate[0]?.created_at || null,
      newest_entry: entries[entries.length - 1]?.created_at || null,
      tags_count: tagCounts,
    };
  }

  /**
   * Compact storage (remove old entries, deduplicate)
   * Can be run periodically to save space
   */
  async compact(keepDaysOld: number = 30): Promise<number> {
    const entries = await this.getAllEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - keepDaysOld);

    let removed = 0;
    for (const entry of entries) {
      if (new Date(entry.updated_at) < cutoffDate) {
        await this.deleteEntry(entry.id);
        removed++;
      }
    }

    return removed;
  }
}

/**
 * Singleton instance
 */
let store: SecondBrainStore | null = null;

export async function getSecondBrainStore(): Promise<SecondBrainStore> {
  if (!store) {
    store = new SecondBrainStore();
    await store.initialize();
  }
  return store;
}

/**
 * Reset singleton (useful for testing)
 */
export function resetSecondBrainStore(): void {
  store = null;
}
