# Client documentation

| What | Where |
|---|---|
| Page-wise flows (UI → API → server → DB) | [pages/README.md](pages/README.md) |
| Client decisions (ADRs) | [adr/README.md](adr/README.md) |
| API docs (OpenAPI, Swagger UI, Postman) | server: [openapi.yaml](../../7th-sense-server/docs/api/openapi.yaml), [postman/](../../7th-sense-server/docs/postman/) |

## How to view the page flow docs

The page docs are Markdown files with Mermaid sequence diagrams.

- **GitHub / GitLab:** open any file under `docs/pages/`. Diagrams render automatically.
- **VS Code:** install the extension **Markdown Preview Mermaid Support** (`bierner.markdown-mermaid`). Open a page doc and press `Ctrl+Shift+V` (preview) or `Ctrl+K V` (preview to the side). File links in the steps open the source files.
- Start from [pages/README.md](pages/README.md): it lists every route with its flow doc.

## How to view the API docs in Chrome (Swagger UI)

Swagger UI is served by the Go server and is off by default.

1. In `7th-sense-server/.env` add:
   ```
   API_DOCS=true
   ```
2. Restart the server (`air`, `go run ./cmd/server` or `7th-sense-start.ps1`). The log shows `API docs at /api-docs/`.
3. Open **http://localhost:8080/api-docs/** in Chrome. If `.env` sets `PORT`, use that port. The raw spec is at `/api-docs/openapi.yaml`.

**Try the API from the page**

1. In the **Servers** dropdown, choose **/api – This server**.
2. Open **Auth → POST /v1/auth/login**, click **Try it out**, enter a username and password, then click **Execute**.
3. Chrome now keeps the HttpOnly `ts_session` cookie, so every other endpoint works with **Try it out**. You don't need the Authorize button.

**Troubleshooting**

- **404 at `/api-docs/`:** `API_DOCS=true` is missing from the server's `.env` (not the client's), or the server was not restarted.
- **401 on calls:** the session expired. Log in again (step 2 above).
- **An endpoint is missing or out of date:** in the server folder, run `go generate ./docs/api`, then restart the server.

Each page doc's "API calls on this page" table links straight to its Swagger operation (`/api-docs/index.html#/<Tag>/<operationId>`).

## How to use Postman

1. In Postman, choose **Import** and select both files in `7th-sense-server/docs/postman/`.
2. Select the **7th Sense — local** environment and set `username` and `password`.
3. Run **Auth › Login** first. Postman's cookie jar then sends the session cookie on every later request.
4. The Collection Runner creates, updates and deletes rows, so use it only against a development database.
