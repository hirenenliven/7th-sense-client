# 0022. Ponytail plugin for Claude Code, under this repo's rules

- **Date:** 2026-11-06
- **Status:** Accepted

## Context

The team wants Claude Code to produce smaller changes at lower cost. Ponytail is a Claude Code plugin that loads "smallest complete change" rules into every session. Its published benchmark shows less code and lower cost at about the same correctness, but that benchmark ran with `CLAUDE.md` switched off, and this repo depends on `CLAUDE.md`. Some of its rules also differ from ours: it asks for a small test or self-check, and this repo has no test framework.

## Decision

- Enable `ponytail@ponytail` at project scope in `.claude/settings.json` (the same in the server repo, server ADR 0011), so everyone working in this repo gets the same setup.
- `CLAUDE.md` has a Ponytail section that says this repo's rules win where the two differ.
- It is active only when Claude Code starts in this folder: the workspace root is not a project with this setting.
- The optional webhook stays unset, so its task records stay on each developer's machine (`~/.config/ponytail/band/`).

## Alternatives considered

- **No plugin, tighter `CLAUDE.md` only:** no third-party code, but no reusable review commands either. Trimming `CLAUDE.md` remains worth doing on its own.
- **Per-developer install:** nothing shared in the repo, but developers would get different behaviour for the same task.
- **Copy the rules into `CLAUDE.md`:** no hooks to run, but we would have to maintain a copy and it adds to an already large file.

## Consequences

- Each session loads about 1.2k more tokens of rules; the plugin's skills cost more only when used.
- Hooks run a third-party Node.js script at session start, on each prompt and on subagent start, so `node` must be on `PATH`. Plugin updates are third-party code too: review them before updating.
- Replies get shorter and may skip nice-to-have extras, so requests need to state what they want. `/ponytail lite` or "stop ponytail" relaxes it for a session.
- Keep it only if real use shows no increase in rework; if not, remove it from `.claude/settings.json` and `CLAUDE.md`.
