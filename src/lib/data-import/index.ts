/**
 * Synthia™ Data Import Engine
 *
 * Parse and import conversations from:
 * - ChatGPT exports (json)
 * - Claude conversation exports (json/csv)
 * - Notion exports (json/csv/html)
 * - Generic markdown archives
 *
 * All data stays local in IndexedDB. Sovereign by default.
 */

export interface ConversationEntry {
  id: string;
  source: 'chatgpt' | 'claude' | 'notion' | 'generic';
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface SecondBrainEntry {
  id: string;
  title: string;
  content: string;
  source: 'conversation' | 'manual' | 'imported';
  tags: string[];
  created_at: string;
  updated_at: string;
  reference_conversation_id?: string;
}

/**
 * Parse ChatGPT exported JSON format
 *
 * Expected structure from openai.com/api/auth/export:
 * {
 *   "title": "...",
 *   "create_time": timestamp,
 *   "update_time": timestamp,
 *   "mapping": {
 *     "node_id": {
 *       "message": {
 *         "id": "...",
 *         "author": {"role": "user|assistant"},
 *         "content": {"parts": ["..."]}
 *       }
 *     }
 *   }
 * }
 */
export function parseChatGPTExport(jsonContent: string): ConversationEntry {
  try {
    const data = JSON.parse(jsonContent);

    const messages: Message[] = [];
    if (data.mapping && typeof data.mapping === 'object') {
      Object.values(data.mapping).forEach((node: any) => {
        if (node.message) {
          const message = node.message;
          const content = message.content?.parts?.join('') || '';
          if (content) {
            messages.push({
              id: message.id,
              role: message.author?.role || 'user',
              content,
              timestamp: new Date(message.create_time * 1000).toISOString(),
            });
          }
        }
      });
    }

    return {
      id: `chatgpt-${Date.now()}`,
      source: 'chatgpt',
      title: data.title || 'ChatGPT Conversation',
      messages,
      created_at: new Date(data.create_time * 1000).toISOString(),
      updated_at: new Date(data.update_time * 1000).toISOString(),
      tags: ['imported', 'chatgpt'],
    };
  } catch (error) {
    throw new Error(`Failed to parse ChatGPT export: ${error}`);
  }
}

/**
 * Parse Claude conversation export (JSON format)
 *
 * Expected from claude.ai export:
 * {
 *   "title": "...",
 *   "created_at": "2026-05-02T...",
 *   "updated_at": "2026-05-02T...",
 *   "messages": [
 *     {"role": "user", "content": "..."},
 *     {"role": "assistant", "content": "..."}
 *   ]
 * }
 */
export function parseClaudeExport(jsonContent: string): ConversationEntry {
  try {
    const data = JSON.parse(jsonContent);

    return {
      id: `claude-${Date.now()}`,
      source: 'claude',
      title: data.title || 'Claude Conversation',
      messages: (data.messages || []).map((msg: any) => ({
        role: msg.role || 'user',
        content: msg.content || '',
        timestamp: msg.timestamp,
      })),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      tags: ['imported', 'claude'],
    };
  } catch (error) {
    throw new Error(`Failed to parse Claude export: ${error}`);
  }
}

/**
 * Parse Notion export (simplified JSON structure)
 * Notion exports are complex; this handles common patterns
 */
export function parseNotionExport(jsonContent: string): SecondBrainEntry[] {
  try {
    const data = JSON.parse(jsonContent);
    const entries: SecondBrainEntry[] = [];

    // Handle Notion database rows
    if (Array.isArray(data)) {
      data.forEach((item: any, index: number) => {
        entries.push({
          id: `notion-${Date.now()}-${index}`,
          source: 'imported',
          title: item.title || item.Name || `Notion Item ${index}`,
          content: item.content || item.Description || item.text || '',
          tags: ['imported', 'notion', ...(item.tags || [])],
          created_at: item.created_time || new Date().toISOString(),
          updated_at: item.last_edited_time || new Date().toISOString(),
        });
      });
    }

    return entries;
  } catch (error) {
    throw new Error(`Failed to parse Notion export: ${error}`);
  }
}

/**
 * Generic markdown importer
 * Parse plain markdown files as brain entries
 */
export function parseMarkdownEntry(
  markdown: string,
  title: string = 'Imported Note'
): SecondBrainEntry {
  // Extract first heading as title if present
  const headingMatch = markdown.match(/^#+\s+(.+)$/m);
  const extractedTitle = headingMatch ? headingMatch[1] : title;

  // Remove heading from content if extracted
  const content = headingMatch ? markdown.replace(/^#+\s+.+\n?/m, '') : markdown;

  return {
    id: `markdown-${Date.now()}`,
    source: 'imported',
    title: extractedTitle,
    content: content.trim(),
    tags: ['imported', 'markdown'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Auto-detect export format and parse accordingly
 *
 * Returns either a ConversationEntry (for chat exports) or array of SecondBrainEntries (for notes)
 */
export function autoParseExport(
  content: string,
  filename: string
): ConversationEntry | SecondBrainEntry | SecondBrainEntry[] {
  const lower = filename.toLowerCase();

  // Detect format by filename pattern
  if (lower.includes('chatgpt') || lower.includes('openai')) {
    return parseChatGPTExport(content);
  }

  if (lower.includes('claude')) {
    return parseClaudeExport(content);
  }

  if (lower.includes('notion')) {
    return parseNotionExport(content);
  }

  // Try JSON parsing for structured data
  if (filename.endsWith('.json')) {
    try {
      const data = JSON.parse(content);

      // Heuristic: If it has a "mapping" key, likely ChatGPT
      if (data.mapping) {
        return parseChatGPTExport(content);
      }

      // Heuristic: If it has "messages" key and title, likely Claude
      if (data.messages && data.title) {
        return parseClaudeExport(content);
      }

      // Otherwise treat as Notion-like array
      if (Array.isArray(data)) {
        return parseNotionExport(content);
      }

      // Single object → convert to brain entry
      return parseMarkdownEntry(JSON.stringify(data, null, 2), data.title || filename);
    } catch {
      // Fall through to markdown parser
    }
  }

  // Default: treat as markdown
  return parseMarkdownEntry(content, filename);
}

/**
 * Extract conversational entries from any import source
 * Useful for building initial second brain from conversation history
 */
export function extractBrainEntriesFromConversation(
  conversation: ConversationEntry
): SecondBrainEntry[] {
  const entries: SecondBrainEntry[] = [];

  // Group consecutive messages by topic/theme
  const messageBlocks: Message[][] = [];
  let currentBlock: Message[] = [];

  conversation.messages.forEach((msg, index) => {
    currentBlock.push(msg);

    // Break blocks on user message or every 5 messages
    if (msg.role === 'user' || currentBlock.length >= 5 || index === conversation.messages.length - 1) {
      messageBlocks.push(currentBlock);
      currentBlock = [];
    }
  });

  // Convert blocks to entries
  messageBlocks.forEach((block, index) => {
    const content = block.map((msg) => `**${msg.role}**: ${msg.content}`).join('\n\n');

    entries.push({
      id: `brain-${conversation.id}-${index}`,
      source: 'conversation',
      title: `${conversation.title} - Part ${index + 1}`,
      content,
      tags: [...conversation.tags, `block-${index}`],
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      reference_conversation_id: conversation.id,
    });
  });

  return entries;
}
