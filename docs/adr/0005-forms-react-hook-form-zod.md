# 0005. Forms with react-hook-form and zod

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

Forms (login, masters, machines, schedules) need validation with clear messages.

## Decision

Use react-hook-form with zod schemas (`@hookform/resolvers/zod`); the server validates again in its DTO `Validate()`.

## Alternatives considered

- Formik + Yup
- Hand-written state and checks

## Consequences

- Little re-rendering; one schema per form.
- Rules exist twice (client zod, server Validate): keep them in step.
