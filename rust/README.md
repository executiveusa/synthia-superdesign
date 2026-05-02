# Rust Infrastructure — Synthia™ Studio
# Version: 1.0.0

## Overview

Synthia™ uses Rust for all durable production infrastructure: event processing, validation, indexing, routing, packaging, and mobile bridges. Rust is chosen for reliability, performance, and long-term maintainability.

## Workspace Structure

```
rust/
├── Cargo.toml              (workspace root)
├── cli/                    (synthia CLI)
├── mcp/                    (MCP server for agent tool access)
├── bridges/                (integration bridges)
├── validators/             (doctrine + schema validators)
├── indexers/               (knowledge graph + search index)
├── parsers/                (file format parsers)
├── graph-tools/            (relationship graph utilities)
├── sync-tools/             (repo reconciliation)
└── crates/
    ├── synthia-event-bus/       Event normalization and routing
    ├── synthia-observer/        Observability API (SSE/WebSocket)
    ├── synthia-router/          Task routing engine
    ├── synthia-validator/       Doctrine + anti-pattern validator
    ├── synthia-packager/        Artifact packaging and export
    ├── synthia-heartbeat/       Agent heartbeat relay
    ├── synthia-memory-compiler/ Memory compaction and indexing
    ├── synthia-mobile-bridge/   Mobile-safe API layer
    ├── synthia-payment-state/   Payment state normalization
    └── synthia-design-indexer/  Studio knowledge graph compiler
```

## Crate Descriptions

### synthia-event-bus
- Normalized event ingestion from all agents
- Append-only event log (file-backed or SQLite)
- Pub/sub for real-time consumers
- Event replay capability
- Schema validation on ingest

### synthia-observer
- SSE endpoint for real-time dashboard updates
- WebSocket support for interactive views
- Per-job and per-agent event filtering
- Summary generation for mobile views
- Timeline reconstruction from events

### synthia-router
- Task classification engine
- Agent assignment based on task-routing.yaml
- Skill/doctrine dependency resolution
- Load balancing across agent instances
- Escalation rule enforcement

### synthia-validator
- Anti-pattern detection (regex-based from registry.yaml)
- Doctrine compliance checking
- HTML output validation (banned fonts, banned colors, etc.)
- Schema validation for job contracts, events, payments
- CI/CD integration for pre-commit checks

### synthia-packager
- Artifact bundling for client delivery
- HTML/CSS/JS minification and optimization
- Asset collection and manifest generation
- ZIP/tar archive creation
- Deployment manifest generation

### synthia-heartbeat
- Agent heartbeat collection and relay
- Health status aggregation
- Stale agent detection
- Alert generation for offline agents
- Heartbeat history for reliability metrics

### synthia-memory-compiler
- Memory entry deduplication
- Pattern extraction from approved work
- Lesson consolidation
- Stale entry detection
- Knowledge graph update generation

### synthia-mobile-bridge
- Lightweight REST API for mobile dashboard
- Job status queries
- Agent status queries
- Approval action endpoints
- Push notification triggers

### synthia-payment-state
- Payment event normalization across providers (Stripe, Creem, Cash App)
- Invoice state machine
- Revenue ledger writer
- Webhook signature verification
- Fulfillment trigger logic

### synthia-design-indexer
- Studio catalog generation from file system
- Component registry compilation
- Doctrine map generation
- Searchable full-text index
- Taxonomy classification

## CLI Commands

```
synthia inventory          List all studio artifacts
synthia plan <brief>       Generate design plan from brief
synthia classify <file>    Classify an artifact
synthia generate <type>    Generate artifact from template
synthia review <file>      Run automated review checks
synthia repair <file>      Apply automated fixes
synthia package <job_id>   Package job for delivery
synthia search <query>     Search studio knowledge
synthia heartbeat          Show agent health status
synthia audit <url>        Run site audit
synthia index              Rebuild studio index
synthia validate           Check doctrine compliance
```

## Build & Run

```bash
# Build all crates
cargo build --workspace

# Run CLI
cargo run -p synthia-cli -- inventory

# Run event bus service
cargo run -p synthia-event-bus -- serve --port 8080

# Run observer (SSE endpoint)
cargo run -p synthia-observer -- serve --port 8081

# Run validator as CI check
cargo run -p synthia-validator -- check ./studio/
```

## Dependencies (key crates)

```toml
[workspace.dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
serde_yaml = "0.9"
axum = "0.7"
sqlx = { version = "0.8", features = ["runtime-tokio", "sqlite"] }
uuid = { version = "1", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
regex = "1"
glob = "0.3"
clap = { version = "4", features = ["derive"] }
tracing = "0.1"
tracing-subscriber = "0.3"
```

## Implementation Priority

| Priority | Crate | Rationale |
|----------|-------|-----------|
| P0 | synthia-validator | Immediate value: catch anti-patterns in CI |
| P0 | synthia-design-indexer | Immediate value: searchable studio catalog |
| P1 | synthia-event-bus | Foundation for observability |
| P1 | synthia-router | Foundation for task automation |
| P1 | synthia-cli | Developer experience |
| P2 | synthia-observer | Dashboard backend |
| P2 | synthia-heartbeat | Agent monitoring |
| P2 | synthia-packager | Delivery automation |
| P3 | synthia-memory-compiler | Long-term learning |
| P3 | synthia-mobile-bridge | Mobile access |
| P3 | synthia-payment-state | Revenue operations |
