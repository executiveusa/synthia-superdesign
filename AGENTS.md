# AGENTS.md — Synthia™ Sovereign Studio

## Identity
This is Synthia™ — sovereign personal AI studio for Latin American creators.
Brand: Kupuri Media™ × The Pauli Effect™
Mission: "Tu IA. Tu datos. Tu negocio."
Quality floor: UDEC 8.5/10 on all frontend output. Never ship below this.

## Tool rules
- Always use rg for search, never grep
- Always use apply_patch for file edits, never cat > file
- Parallelize all file reads — batch everything, read nothing one-by-one
- Run npm run build after every phase and fix all TypeScript errors before committing
- Run npm run lint before any commit
- Non-interactive git only — no rebase -i, no reset --hard, no git checkout --
- Never commit secrets, API keys, or .env files

## Design system (non-negotiable)
- Palette: primary #c4963c, accent #5a7a52, dark #0a1108, surface #1a2a1a, text #f5f0e8, muted #8a9e7e
- Fonts: Playfair Display (headings italic), DM Mono (labels/code), Lato (body)
- Every component mobile-first. Must work at 375px viewport minimum.
- All user-facing strings have Spanish (es) and English (en) variants.
- No purple gradients, no Inter font, no neon on dark backgrounds.

## Commit format
[SYNTHIA][PHASE-N] type: description
type: feat | fix | style | refactor | docs | test | chore

## Verification
After each phase: npm run build must pass, npm run lint must pass.
After phases 2-10: manually confirm the primary route renders at localhost:3000.


## Generated-brand visual independence
The Synthia palette, typography, and product chrome above govern **Synthia itself**. They are not default aesthetics for client brands, generated websites, campaigns, apps, or unrelated products.

For any generated or redesigned brand surface, read `skills/visual-independence-governor/SKILL.md` before visual implementation.

Non-negotiable generated-work laws:
- consistency belongs inside a brand, not across unrelated brands;
- preserve quality standards, not Synthia's appearance;
- derive a project-specific Visual World Brief before visual BUILD;
- do not export Synthia's palette, fonts, hero structure, spacing personality, component skin, or motion language unless the target brand independently justifies them;
- compare against nearby portfolio work and reject recolored/reworded duplicates;
- ADHD-friendly clarity means low cognitive friction, not mandatory minimalism;
- reuse engineering primitives, not brand costume.
