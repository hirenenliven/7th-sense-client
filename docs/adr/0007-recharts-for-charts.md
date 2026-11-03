# 0007. Recharts for charts, plain SVG for the Gantt

- **Date:** 2026-11-03
- **Status:** Accepted (Inferred from existing code)

## Context

Dashboards need line, bar, grouped and donut charts, plus a live Gantt timeline.

## Decision

Wrap Recharts in shared components (`components/charts/*`: BarLineChart, LineTrendChart, GroupedBarChart, DonutChart). The machine mode Gantt (`ModeGanttChart`) is plain SVG because it grows every second and zooms.

## Alternatives considered

- Chart.js
- ECharts
- D3 directly

## Consequences

- Charts share one look and API.
- Very large datasets may need downsampling.
