# Open Questions — Cynthia Migration
# Track unresolved decisions that need human input

## Q1: Telegram Bot Token
**Status**: NEEDS_INPUT
**Context**: Hermes communicates with Bambu via Telegram. Bot token needs to be provisioned and stored in Infisical.
**Required**: Telegram bot token, chat ID for Bambu
**Impact**: Blocks automated delivery notifications

## Q2: ElevenLabs Voice IDs
**Status**: NEEDS_INPUT  
**Context**: Bass Agent needs voice IDs for SYNTHIA, PAULI, QUERENCIA_NARRATOR, IVETTE characters.
**Required**: ElevenLabs account + voice clone setup
**Impact**: Blocks audio/video production pipeline

## Q3: Suno API Access
**Status**: NEEDS_INPUT
**Context**: Bass Agent needs Suno API for music generation (querencia_ambient, synthia_theme, archon_theme).
**Required**: Suno API key + credits
**Impact**: Blocks music production

## Q4: Cloudflare Pages Domain
**Status**: NEEDS_INPUT
**Context**: Where do delivered websites deploy? Need Cloudflare Pages project + custom domain.
**Required**: Cloudflare account, domain configuration
**Impact**: Blocks website delivery

## Q5: Stripe Account Configuration
**Status**: NEEDS_INPUT
**Context**: Payment processing needs Stripe account with correct products/prices configured.
**Required**: Stripe account, product setup, webhook endpoint
**Impact**: Blocks paid conversions

## Q6: Creem MoR Setup
**Status**: NEEDS_INPUT
**Context**: International payments need Creem Merchant of Record setup.
**Required**: Creem account + integration
**Impact**: Blocks international sales

## Q7: VPS Hermes Deployment
**Status**: NEEDS_INPUT
**Context**: Hermes agent should run on VPS 31.220.58.212 as always-on service.
**Required**: SSH access, hermes-agent installation, service configuration
**Impact**: Blocks autonomous studio operation

## Q8: Blender Headless Rendering
**Status**: NEEDS_INPUT
**Context**: Blender Agent needs headless Blender on a machine with GPU for 3D rendering.
**Required**: Blender installation on VPS or dedicated render server
**Impact**: Blocks 3D production pipeline

## Q9: Portfolio Content
**Status**: NEEDS_INPUT
**Context**: Landing page needs real portfolio items. Are Querencia, Golden Hearts, Kupuri Landing approved for public showcase?
**Required**: Bambu approval on which projects to showcase
**Impact**: Blocks landing page content quality (CON axis)

## Q10: Client Onboarding Flow
**Status**: NEEDS_DISCUSSION
**Context**: How prescriptive should the intake form be? Minimal (just URL) vs detailed (brand, goals, competitors, budget)?
**Recommendation**: Start minimal, progressively reveal fields. Don't scare away free audit leads.
**Impact**: Affects conversion rate modeling
