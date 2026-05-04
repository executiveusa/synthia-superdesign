/**
 * POST /api/onboarding/import
 *
 * Handle data import from ChatGPT, Claude, Notion exports
 * Accepts multipart form with file
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOnboardingManager } from '@/lib/onboarding/manager';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const manager = getOnboardingManager();
    const result = await manager.startImport(file);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    );
  }
}
