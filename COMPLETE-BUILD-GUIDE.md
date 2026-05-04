# Synthia™ Complete Build Guide

**Version**: 1.0.0  
**Status**: ✅ Phase 1–10 Complete  
**Built**: 2026-05-04

---

## Overview

Synthia™ is now a **complete, sovereign personal AI platform** with three integration paths:

1. **API** — RESTful HTTP endpoints (localhost:3000)
2. **MCP** — Claude Model Context Protocol for AI agents
3. **CLI** — Command-line interface for automation

Connect **any website, tool, or AI system** to Synthia™ without changing a line of code.

---

## Quick Start (5 minutes)

### 1. Environment Setup

```bash
# Copy the white-label template
cp .env.whitelabel.example .env.local

# Fill in required values (minimal config)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# CREEM_API_KEY=
# MUAPI_API_KEY=
```

### 2. Start the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Verify health
curl http://localhost:3000/api/health
```

### 3. Test Integration

```bash
# Via CLI
synthia health
synthia brain search "test"

# Via API
curl http://localhost:3000/api/brain

# Via MCP (with Claude)
npx @anthropic-ai/mcp-server-stdio --command synthia-mcp
```

---

## API Reference

All endpoints return JSON. Base URL: `http://localhost:3000`

### Onboarding

#### Import Data

```bash
POST /api/onboarding/import
Content-Type: multipart/form-data

# Upload ChatGPT/Claude/Notion export
curl -F "file=@export.json" \
  http://localhost:3000/api/onboarding/import

# Response
{
  "status": "complete",
  "file_name": "export.json",
  "entries_imported": 42,
  "progress_percent": 100
}
```

#### Setup Tool (BYOT)

```bash
POST /api/onboarding/tool

{
  "provider": "openai",
  "api_key": "sk-..."
}

# Response
{
  "provider": "openai",
  "configured": true,
  "verified": true,
  "models_available": ["gpt-4", "gpt-3.5-turbo"]
}
```

### Second Brain

#### Search

```bash
GET /api/brain?q=<query>&tag=<tag>&limit=50

# Example
curl "http://localhost:3000/api/brain?q=AI%20development&limit=10"

# Response
{
  "entries": [
    {
      "id": "brain-123",
      "title": "AI Development Best Practices",
      "content": "...",
      "tags": ["ai", "development"],
      "created_at": "2026-05-04T...",
      "updated_at": "2026-05-04T..."
    }
  ],
  "count": 1
}
```

#### Add Entry

```bash
POST /api/brain

{
  "title": "My Note",
  "content": "This is my note content",
  "tags": ["personal", "ideas"],
  "source": "manual"
}

# Response
{
  "success": true,
  "entry": {
    "id": "brain-...",
    "title": "My Note",
    ...
  }
}
```

#### Get All Entries

```bash
GET /api/brain

# With filters
GET /api/brain?tag=ai
GET /api/brain?source=imported

# Response: same as search
```

#### Delete Entry

```bash
DELETE /api/brain?id=<entry-id>

# Response
{
  "success": true,
  "deleted_id": "brain-123"
}
```

### Health & Status

#### Health Check

```bash
GET /api/health

# Response
{
  "status": "healthy",
  "message": "All systems operational",
  "timestamp": "2026-05-04T...",
  "brand": {
    "name": "Synthia™",
    "version": "1.0.0"
  },
  "systems": {
    "startup_validation": true,
    "database": true,
    "secondbrain": {
      "initialized": true,
      "entries": 42
    }
  },
  "features": {
    "second_brain": true,
    "chat_interface": true,
    "media_generation": true,
    "byot": true
  }
}
```

### Payments (Creem.io Webhook)

```bash
POST /api/webhooks/creem

# This endpoint is called by Creem.io when payment succeeds
# Automatically:
# 1. Validates webhook signature (HMAC-SHA256)
# 2. Calculates 2% pledge
# 3. Routes pledge to LATAM eco + AI literacy fund
# 4. Activates user account
# 5. Sends confirmation email

# Verify with:
# CREEM_WEBHOOK_SECRET=<secret>
```

---

## MCP (Model Context Protocol) Integration

Use Synthia™ with Claude or any MCP-compatible AI system.

### Installation

```bash
# Start MCP server
npx synthia-mcp

# Use with Claude Code
# In settings.json:
{
  "mcpServers": {
    "synthia": {
      "command": "synthia-mcp"
    }
  }
}
```

### Available Tools

Every tool is accessible from Claude:

#### Brain Tools

- **`brain_search`** — Search second brain
  ```
  brain_search(query="AI development", tag="work", limit=20)
  ```

- **`brain_add_entry`** — Add new entry
  ```
  brain_add_entry(
    title="Meeting Notes",
    content="...",
    tags=["meetings", "2026-05"],
    source="manual"
  )
  ```

- **`brain_export`** — Export entire second brain
  ```
  brain_export() → JSON backup
  ```

#### Tool Management

- **`tools_list`** — Show configured providers
  ```
  tools_list() → [{ provider: "openai", configured: true }]
  ```

- **`tools_add`** — Add API key for provider
  ```
  tools_add(provider="openai", api_key="sk-...")
  ```

#### Media Generation

- **`media_generate`** — Generate image/video
  ```
  media_generate(
    prompt="sunset landscape",
    media_type="image",
    model="flux-pro"
  ) → { job_id: "...", status: "queued" }
  ```

#### System

- **`system_status`** — Get platform status
- **`system_validate`** — Check environment

### Example: Claude Workflow

```
You: "Add my ChatGPT conversation history to my second brain"

Claude:
1. Calls brain_import() to import ChatGPT export
2. Calls brain_search() to verify entries added
3. Returns summary

You: "Generate an image of a futuristic city"

Claude:
1. Calls media_generate() with your prompt
2. Polls status until complete
3. Returns image URL
```

---

## CLI (Command-Line Interface)

### Installation

```bash
# Build from source
cd rust/cli
cargo build --release

# Add to PATH
export PATH=$PATH:./target/release

# Or install globally
cargo install --path .
```

### Commands

#### Brain Operations

```bash
# Search
synthia brain search "AI development" --limit 20
synthia brain search "notes" --tag work

# Add entry
synthia brain add \
  --title "Meeting Notes" \
  --content "Discussion about Q2 goals" \
  --tags "meetings,goals"

# Export
synthia brain export
synthia brain export --output backup.json

# Import
synthia brain import export.json

# Statistics
synthia brain stats
```

#### Media Generation

```bash
# Generate image
synthia media image "sunset landscape" --size 1024x1024

# Generate video
synthia media video "flying through a forest" --duration 10

# Cinematic video
synthia media cinema "epic space scene" \
  --camera pan \
  --lighting cinematic \
  --duration 15

# Check status
synthia media status job-123
```

#### BYOT Tools

```bash
# List configured tools
synthia tools list

# Add API key
synthia tools add openai --key sk-...
synthia tools add anthropic --key sk-ant-...

# Remove
synthia tools remove openai

# Verify
synthia tools verify openai
```

#### System

```bash
# Health check
synthia health

# Validate environment
synthia validate

# System status
synthia status

# Import data
synthia import export.json

# Export all data
synthia export
synthia export --output my-backup.json
```

---

## Configuration (White-Label)

Synthia™ is fully configurable via environment variables. **Zero code changes.**

### Essential Variables

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Payments (required for production)
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=
CREEM_STARTER_ID=
CREEM_PROFESSIONAL_ID=
CREEM_OPERATOR_ID=

# Media generation (optional, but recommended)
MUAPI_API_KEY=
```

### Branding Variables

```bash
# Override everything
WL_BRAND_NAME="Synthia™ Colombia"
WL_TAGLINE="Tu IA soberana"
WL_PRIMARY_COLOR="#c4963c"
WL_SECONDARY_COLOR="#5a7a52"
WL_LANGUAGE=es
WL_COUNTRY=CO
WL_NICHE=ecommerce
```

### Feature Flags

```bash
WL_FEATURE_SECOND_BRAIN=true
WL_FEATURE_CHAT=true
WL_FEATURE_MEDIA=true
WL_FEATURE_BYOT=true
WL_FEATURE_PORTFOLIO=true
WL_FEATURE_COMMUNITY=true
```

See `.env.whitelabel.example` for all options.

---

## Architecture Overview

### Layers

```
┌─────────────────────────────────────┐
│  Interface Layer                     │
│  - Next.js Web App (React)           │
│  - CLI (Rust)                        │
│  - MCP Server                        │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│  API Layer                           │
│  - RESTful endpoints (next/app/api/) │
│  - Authentication                    │
│  - Validation                        │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│  Business Logic Layer                │
│  - Onboarding flows                  │
│  - Second brain (IndexedDB)          │
│  - BYOT key manager                  │
│  - Media generation (muapi)          │
│  - Payments (Creem.io)               │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│  Data Layer                          │
│  - IndexedDB (local sovereignty)     │
│  - Supabase (optional)               │
│  - Third-party APIs                  │
└─────────────────────────────────────┘
```

### Data Flow

```
External AI System (Claude, etc.)
  ↓
MCP Server ←→ API Handlers ←→ Business Logic
  ↓ (or)
CLI ←→ HTTP Client ←→ API Handlers
  ↓
IndexedDB (local, sovereign)
  ↓
[Optional] Supabase / External APIs
```

---

## Deployment

### Local Development

```bash
npm run dev
# Runs on http://localhost:3000
```

### Production (Vercel)

```bash
# Set environment variables in Vercel dashboard
# Then deploy
vercel deploy --prod
```

### Docker

```bash
docker build -t synthia .
docker run -e NEXT_PUBLIC_SUPABASE_URL=... synthia
```

### Custom Server

```bash
npm run build
npm start
# Runs on production port (default 3000)
```

---

## Quality & Self-Assessment (UDEC)

Synthia™ self-assesses on 14 axes:

```bash
# Run UDEC audit
synthia validate --udec

# Output
┌─ UDEC Self-Assessment ────────────┐
│ User Experience (UX):  9.2/10  ✓   │
│ Design System (DS):    8.8/10  ✓   │
│ Engineering (ENG):     9.1/10  ✓   │
│ Craft (CRF):          8.9/10  ✓   │
│                                    │
│ Motion & Interaction: 8.5/10  ✓    │
│ Accessibility:        8.7/10  ✓    │
│                                    │
│ Overall: 8.87/10 ✅               │
└────────────────────────────────────┘
```

**Hard Minimums**:
- Motion & Interaction ≥ 7.0
- Accessibility ≥ 7.0
- Overall ≥ 8.5

---

## Troubleshooting

### "API health check fails"

```bash
# Run validation
synthia validate

# Check environment
env | grep NEXT_PUBLIC
```

### "Second brain not initializing"

```bash
# Clear IndexedDB
# In browser: DevTools → Application → IndexedDB → Delete
# Then refresh page
```

### "Media generation not working"

```bash
# Verify muapi.ai key
synthia tools verify muapi

# If not set:
export MUAPI_API_KEY=your-key
npm run dev
```

### "BYOT keys not persisting"

- Keys are stored encrypted in localStorage
- Clear cache/cookies won't delete them
- Use `synthia tools remove <provider>` to delete

---

## Support & Pledges

### 2% Pledge

Every purchase supports:
- 🌱 Ecological restoration in LATAM
- 📚 AI literacy programs for underserved communities

View transparency report: https://synthia.ai/pledge

### Community

- GitHub: https://github.com/executiveusa/synthia-superdesign
- Discussions: https://github.com/executiveusa/synthia-superdesign/discussions
- Issues: https://github.com/executiveusa/synthia-superdesign/issues

---

## Next Steps

1. **For Developers**: Set up local env, run `npm run dev`
2. **For AI Systems**: Connect via MCP or API
3. **For Deployment**: Copy `.env.whitelabel.example` to `.env.local`, customize, deploy
4. **For Automation**: Use CLI for scripting and CI/CD

---

**Synthia™** — Your sovereign AI. Your data. Your business.

Your AI platform respects your sovereignty by design.
