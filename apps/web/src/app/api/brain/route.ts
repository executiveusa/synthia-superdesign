/**
 * GET /api/brain — Get all second brain entries
 * POST /api/brain — Add new entry
 * DELETE /api/brain/[id] — Delete entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecondBrainStore } from '@/lib/second-brain/store';
import type { SecondBrainEntry } from '@/lib/data-import/index';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.search);
    const query = searchParams.get('q');
    const tag = searchParams.get('tag');
    const source = searchParams.get('source');

    const store = await getSecondBrainStore();

    let entries: SecondBrainEntry[] = [];

    if (query) {
      entries = await store.searchEntries(query);
    } else if (tag) {
      entries = await store.getEntriesByTag(tag);
    } else if (source) {
      entries = await store.getEntriesBySource(source);
    } else {
      entries = await store.getAllEntries();
    }

    return NextResponse.json({ entries, count: entries.length });
  } catch (error) {
    console.error('[API] Brain GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const entry: SecondBrainEntry = await request.json();

    if (!entry.title || !entry.content) {
      return NextResponse.json(
        { error: 'title and content required' },
        { status: 400 }
      );
    }

    const store = await getSecondBrainStore();

    // Generate ID if not provided
    if (!entry.id) {
      entry.id = `brain-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    // Set timestamps
    if (!entry.created_at) {
      entry.created_at = new Date().toISOString();
    }
    entry.updated_at = new Date().toISOString();

    await store.saveEntry(entry);

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('[API] Brain POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.search);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id query parameter required' },
        { status: 400 }
      );
    }

    const store = await getSecondBrainStore();
    await store.deleteEntry(id);

    return NextResponse.json({ success: true, deleted_id: id });
  } catch (error) {
    console.error('[API] Brain DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
