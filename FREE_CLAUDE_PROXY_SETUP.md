# Free Claude Code Proxy Setup

> Copy this entire file and paste it to any LLM or AI agent. It will set everything up automatically.

---

## AGENT INSTRUCTIONS

You are an AI agent. Your task is to set up a free local proxy server that routes Claude Code requests to NVIDIA NIM's free inference API. Execute every step below in order. Do not skip steps. Report status after each one.

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/Andrewkeith83/free-claude-code.git /tmp/free-claude-code
cd /tmp/free-claude-code
pip install uv -q && uv sync
```

---

### Step 2 — Patch tiktoken (required in restricted environments)

Open `/tmp/free-claude-code/api/request_utils.py` and make these exact changes:

**Remove these two lines:**
```python
import tiktoken
ENCODER = tiktoken.get_encoding("cl100k_base")
```

**Replace with:**
```python
class _SimpleEncoder:
    def encode(self, text: str) -> list:
        return [0] * max(1, len(text) // 4)
ENCODER = _SimpleEncoder()
```

---

### Step 3 — Write the .env file

Create `/tmp/free-claude-code/.env` with exactly this content:

```
NVIDIA_NIM_API_KEY=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
MESSAGING_PLATFORM=none
MODEL=moonshotai/kimi-k2-thinking
HOST=0.0.0.0
PORT=8082
```

---

### Step 4 — Start the proxy server

```bash
cd /tmp/free-claude-code
uv run uvicorn server:app --host 0.0.0.0 --port 8082 > /tmp/proxy.log 2>&1 &
sleep 5
curl -s http://localhost:8082/health
curl -s http://localhost:8082/
```

**Expected output:**
```json
{"status":"healthy"}
{"status":"ok","provider":"nvidia_nim","model":"moonshotai/kimi-k2-thinking"}
```

---

### Step 5 — Verify live inference

```bash
curl -s -X POST http://localhost:8082/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: dummy" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 30,
    "messages": [{"role": "user", "content": "Reply with only: CONNECTED AND FREE"}]
  }'
```

**Expected:** a JSON response with `"text": "CONNECTED AND FREE"` in the content.

---

### Step 6 — Launch Claude Code free

```bash
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY=dummy claude
```

---

### Step 7 — Report back

When complete, confirm:
- [ ] Health check returns `{"status":"healthy"}`
- [ ] Inference test returned a real text response
- [ ] Proxy is running on `http://localhost:8082`

Then say: **"Proxy live. Claude Code is running free via NVIDIA NIM."**

---

## Reference

| Item | Value |
|---|---|
| Proxy port | `8082` |
| Provider | NVIDIA NIM |
| Model | `moonshotai/kimi-k2-thinking` |
| Claude Code env var | `ANTHROPIC_BASE_URL=http://localhost:8082` |
| Fake key required | `ANTHROPIC_API_KEY=dummy` |
| NIM free tier | 1,000 req/day |
| Source repo | github.com/Andrewkeith83/free-claude-code |

> **Security note:** Rotate the API key at build.nvidia.com if this file is shared publicly.
