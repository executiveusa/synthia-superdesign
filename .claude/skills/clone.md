# Clone Skill

Extract and clone complete design systems from any website using designlang.

## Usage

```
/clone https://example.com
```

Or mention it in conversation:
- "clone this website"
- "extract the design from https://example.com"
- "activate the clone skill for https://example.com"

## What It Does

Extracts comprehensive design system documentation from a target website including:
- **Colors & Gradients** - Complete color palette extraction
- **Typography** - Font families, weights, sizes, and line heights
- **Spacing & Layout** - Grid patterns, flexbox usage, container structures
- **Shadows & Effects** - Box shadows, text shadows, blur effects
- **Interaction States** - Hover, focus, and active state transitions
- **Responsive Breakpoints** - Changes across 4 viewports
- **Accessibility Metrics** - WCAG 2.1 compliance scoring

## Output Formats

Generates 8 files:
1. **design-tokens.md** - AI-optimized markdown documentation
2. **design-tokens.html** - Visual preview
3. **tailwind.config.js** - Tailwind configuration
4. **theme.ts** - React TypeScript theme
5. **design-tokens.json** - JSON format
6. **design-tokens.yaml** - YAML format
7. **styles.css** - CSS variables
8. **accessibility-report.md** - WCAG analysis

## Examples

Extract from a design-focused site:
```
/clone https://dribbble.com
```

Clone an Awwwards winner:
```
/clone https://awwwards.com
```

Get design tokens for a SaaS product:
```
/clone https://stripe.com
```

## Installation

Uses `designlang` (npm package):
```bash
npx designlang https://example.com
```

Or install globally:
```bash
npm install -g designlang
```

---

**Note:** This extracts visual design systems only. For component extraction, use the design-extract repository patterns directly.
