/**
 * POST /api/onboarding/tool
 *
 * Configure BYOT (Bring Your Own Tools) API keys
 * Accepts: { provider: string, api_key: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOnboardingManager } from '@/lib/onboarding/manager';

export async function POST(request: NextRequest) {
  try {
    const { provider, api_key } = await request.json();

    if (!provider || !api_key) {
      return NextResponse.json(
        { error: 'provider and api_key required' },
        { status: 400 }
      );
    }

    const manager = getOnboardingManager();
    const result = await manager.setupTool(provider, api_key);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Tool setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    );
  }
}
