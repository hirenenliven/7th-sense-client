# 0006. React-Bootstrap with SCSS design tokens

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

A consistent light / dark theme is needed across many screens.

## Decision

Use React-Bootstrap components styled with SCSS tokens (`_variables.scss`, light values in `_tokens-light.scss`) exposed as CSS variables `--ts-*`. No inline styles and no hex / px values in JS.

## Alternatives considered

- Tailwind CSS
- MUI

## Consequences

- Themeable through tokens; new colours and sizes go through tokens.
- Bootstrap markup conventions apply.
