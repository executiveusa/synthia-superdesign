#!/usr/bin/env bash
set -euo pipefail

# Adds the Chrome DevTools MCP server to codex.
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest

cat <<MSG

Chrome DevTools MCP configured.
To connect to existing Chrome remote debugging session:
  npx chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222
MSG
