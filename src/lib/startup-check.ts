/**
 * Synthia™ Startup Validation
 *
 * Ensures all required environment variables and credentials are present
 * before the application initializes.
 *
 * Prevents confusing runtime errors by validating early.
 */

export interface StartupCheckResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  timestamp: string;
}

/**
 * Validate environment configuration at startup
 */
export function validateEnvironment(): StartupCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // REQUIRED: Supabase configuration
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  // REQUIRED: Creem.io payment configuration (for production)
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CREEM_API_KEY) {
      errors.push('Missing CREEM_API_KEY for production');
    }
    if (!process.env.CREEM_WEBHOOK_SECRET) {
      errors.push('Missing CREEM_WEBHOOK_SECRET for production');
    }
  } else {
    // Development: warn if not set
    if (!process.env.CREEM_API_KEY) {
      warnings.push('Development mode: CREEM_API_KEY not set (payments will be mocked)');
    }
  }

  // REQUIRED: muapi.ai configuration
  if (!process.env.MUAPI_API_KEY) {
    warnings.push('Development mode: MUAPI_API_KEY not set (media generation will be mocked)');
    if (process.env.NODE_ENV === 'production') {
      errors.push('Production: MUAPI_API_KEY is required');
    }
  }

  // OPTIONAL: White-label configuration (check if set)
  const whitelabelVars = [
    'WL_BRAND_NAME',
    'WL_TAGLINE',
    'WL_PRIMARY_COLOR',
    'WL_NICHE',
    'WL_COUNTRY',
  ];

  const whitelabelSet = whitelabelVars.filter((v) => process.env[v]);
  if (whitelabelSet.length === 0) {
    warnings.push('No white-label configuration detected; using defaults');
  } else if (whitelabelSet.length < whitelabelVars.length) {
    warnings.push(`Partial white-label configuration (${whitelabelSet.length}/${whitelabelVars.length})`);
  }

  // OPTIONAL: Email configuration (for notifications)
  if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
    warnings.push('No email service configured; transactional emails will not work');
  }

  // FEATURE FLAGS: Check what's enabled
  if (process.env.WL_FEATURE_SECOND_BRAIN === 'false') {
    warnings.push('Second Brain feature is disabled');
  }
  if (process.env.WL_FEATURE_CHAT === 'false') {
    warnings.push('Chat interface is disabled');
  }
  if (process.env.WL_FEATURE_BYOT === 'false') {
    warnings.push('BYOT (Bring Your Own Tools) is disabled');
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Assert all validations pass
 * Throws error if any required checks fail
 */
export function assertEnvironmentValid(): void {
  const result = validateEnvironment();

  if (!result.ok) {
    const errorMessage = `
Synthia™ Startup Validation Failed

Errors (${result.errors.length}):
${result.errors.map((e) => `  ❌ ${e}`).join('\n')}

${
  result.warnings.length > 0
    ? `Warnings (${result.warnings.length}):
${result.warnings.map((w) => `  ⚠️  ${w}`).join('\n')}
`
    : ''
}

Please set missing environment variables and restart.
    `.trim();

    throw new Error(errorMessage);
  }

  // Log warnings if any
  if (result.warnings.length > 0) {
    console.warn(
      'Synthia™ Startup Warnings:\n',
      result.warnings.map((w) => `  ⚠️  ${w}`).join('\n')
    );
  }

  console.log('✅ Synthia™ environment validation passed');
}

/**
 * Get validation result as structured data
 * Useful for health check endpoints
 */
export function getStartupCheckStatus(): {
  status: 'healthy' | 'degraded' | 'error';
  validation: StartupCheckResult;
  message: string;
} {
  const validation = validateEnvironment();

  if (!validation.ok) {
    return {
      status: 'error',
      validation,
      message: `${validation.errors.length} critical errors`,
    };
  }

  if (validation.warnings.length > 0) {
    return {
      status: 'degraded',
      validation,
      message: `${validation.warnings.length} warnings`,
    };
  }

  return {
    status: 'healthy',
    validation,
    message: 'All systems operational',
  };
}

/**
 * Print startup status to console
 */
export function printStartupStatus(): void {
  const check = getStartupCheckStatus();

  const statusEmoji =
    check.status === 'healthy'
      ? '✅'
      : check.status === 'degraded'
        ? '⚠️ '
        : '❌';

  console.log(`
╔════════════════════════════════════════╗
║  Synthia™ Startup Check                ║
╚════════════════════════════════════════╝

Status: ${statusEmoji} ${check.status.toUpperCase()}
Message: ${check.message}

Environment: ${process.env.NODE_ENV || 'development'}
Build: ${process.env.NEXT_PUBLIC_BUILD_ID || 'unknown'}
Version: ${process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}

${
  check.validation.errors.length > 0
    ? `Errors:
${check.validation.errors.map((e) => `  ❌ ${e}`).join('\n')}\n`
    : ''
}
${
  check.validation.warnings.length > 0
    ? `Warnings:
${check.validation.warnings.map((w) => `  ⚠️  ${w}`).join('\n')}\n`
    : ''
}
  `);
}
