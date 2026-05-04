/**
 * GET /api/health
 *
 * System health check
 * Returns startup validation, database status, feature flags
 */

import { NextResponse } from 'next/server';
import { getStartupCheckStatus } from '@/lib/startup-check';
import { getSecondBrainStore } from '@/lib/second-brain/store';
import { WHITELABEL, BRAND } from '@/lib/identity';

export async function GET() {
  try {
    const startupStatus = getStartupCheckStatus();
    const store = await getSecondBrainStore();
    const brainStats = await store.getStats();

    const health = {
      status: startupStatus.status,
      message: startupStatus.message,
      timestamp: new Date().toISOString(),

      brand: {
        name: WHITELABEL.name,
        version: BRAND.version,
        language: WHITELABEL.language,
        country: WHITELABEL.country,
      },

      systems: {
        startup_validation: startupStatus.validation.ok,
        database: true,
        secondbrain: {
          initialized: true,
          entries: brainStats.total_entries,
          size_bytes: brainStats.total_bytes,
        },
      },

      features: WHITELABEL.features,

      validation: startupStatus.validation,
    };

    const statusCode = startupStatus.status === 'error' ? 503 : 200;
    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    console.error('[API] Health check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
