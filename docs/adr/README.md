# Architecture Decision Records

Client (frontend) decisions, one file each (Michael Nygard template). Never edit an accepted ADR: write a new one and mark the old one "Superseded by NNNN".

| # | Title | Status | Date |
|---|---|---|---|
| 0001 | [Single-page app with React 19 and Vite](0001-react-vite-spa.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0002 | [React Router with one route table and role guards](0002-central-route-table-with-role-guards.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0003 | [Server state via service modules and useLoad, Context only for the session](0003-data-fetching-with-service-modules.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0004 | [Axios client with the HttpOnly session cookie](0004-axios-with-httponly-session-cookie.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0005 | [Forms with react-hook-form and zod](0005-forms-react-hook-form-zod.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0006 | [React-Bootstrap with SCSS design tokens](0006-react-bootstrap-scss-tokens.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0007 | [Recharts for charts, plain SVG for the Gantt](0007-recharts-for-charts.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0008 | [Folder structure by page and by concern](0008-folder-structure-by-page.md) | Accepted (Inferred from existing code) | 2026-11-03 |
| 0009 | [Page-wise flow documentation in docs/pages](0009-page-wise-flow-documentation.md) | Accepted | 2026-11-03 |
| 0010 | [Organization levels on one tabbed page, a route per tab](0010-organization-tabbed-page.md) | Accepted | 2026-11-03 |
| 0011 | [Business Setup: Customer, Licence Key, Clientele and Machine Catalog on one tabbed page](0011-business-setup-tabbed-page.md) | Superseded by 0014 | 2026-11-03 |
| 0012 | [Monitoring: Productivity and Machine Health on one tabbed page](0012-monitoring-tabbed-page.md) | Superseded by 0013 | 2026-11-03 |
| 0013 | [Monitoring starts with a machine list; All Machines is set-up only](0013-monitoring-machine-list.md) | Superseded by 0019 | 2026-11-04 |
| 0014 | [Business Setup renamed Account Center; old Account Center item removed](0014-account-center.md) | Accepted (Clientele tab superseded by 0015; access amended by 0016) | 2026-11-04 |
| 0015 | [Clientele is a Masters page, not an Account Center tab](0015-clientele-masters-page.md) | Accepted | 2026-11-04 |
| 0016 | [Account Center is superadmin only; Users lists company members only](0016-account-center-superadmin-only.md) | Accepted | 2026-11-04 |
| 0017 | [Log in as customer in a new tab, on the tab's own API path](0017-login-as-customer-tab.md) | Superseded by 0018 | 2026-11-04 |
| 0018 | [Log in as customer opens the dashboard directly (no /login-as page)](0018-login-as-without-route.md) | Accepted | 2026-11-04 |
| 0019 | [Monitoring: machine list, then the machine's tabs with a back arrow](0019-monitoring-machine-view.md) | Accepted | 2026-11-04 |
| 0020 | [Virtual Screen: one REST snapshot polled every 5 s](0020-virtual-screen-polling.md) | Accepted | 2026-11-05 |

New ADR: copy the newest file, take the next number, status "Proposed" until agreed, then "Accepted"; add a row here.
