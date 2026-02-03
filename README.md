# OpenAPI Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/chanfana-openapi-template)

![OpenAPI Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/91076b39-1f5b-46f6-7f14-536a6f183000/public)

<!-- dash-content-start -->

This is a Cloudflare Worker with OpenAPI 3.1 Auto Generation and Validation using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

This template includes various endpoints, a D1 database, and integration tests using [Vitest](https://vitest.dev/) as examples. In endpoints, you will find [chanfana D1 AutoEndpoints](https://chanfana.com/endpoints/auto/d1) and a [normal endpoint](https://chanfana.com/endpoints/defining-endpoints) to serve as examples for your projects.

Besides being able to see the OpenAPI schema (openapi.json) in the browser, you can also extract the schema locally no hassle by running this command `npm run schema`.

<!-- dash-content-end -->

> [!IMPORTANT]
> When using C3 to create this project, select "no" when it asks if you want to deploy. You need to follow this project's [setup steps](https://github.com/cloudflare/templates/tree/main/openapi-template#setup-steps) before deploying.


## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm clean install
   ```
2. Run the following db migration to initialize the SQLite database locally (notice the `migrations` directory in this project):
   ```bash
   npx wrangler d1 migrations apply DB --local
   ```
3. Run the project locally, which will start the database, backend, and documentation hosting.
   ```bash
   npx wrangler dev
   ```
   Terminal output:
   ```plaintext
   ⛅️ wrangler 4.56.0 (update available 4.62.0)
   ─────────────────────────────────────────────
   Your Worker has access to the following bindings:
   Binding                      Resource         Mode
   env.DB (pixel-board-db)      D1 Database      local

   ╭──────────────────────╮
   │  [b] open a browser  │
   │  [d] open devtools   │
   │  [c] clear console   │
   │  [x] to exit         │
   ╰──────────────────────╯
   ⎔ Starting local server...
   [wrangler:info] Ready on http://localhost:8787
   [wrangler:info] GET /boards 200 OK (10ms)
   ```
4. Before deploying remotely, apply your database migrations to the production environment.
   ```bash
   npx wrangler d1 migrations apply DB --local
   ```
5. Push your Worker code to the Cloudflare network. ⚠️ This will make your changes live on the public internet
   ```bash
   npx wrangler deploy
   ```
5. Stream live logs from your production Worker to verify everything is running smoothly.
   ```bash
   npx wrangler tail
   ```

## Testing

This template includes integration tests using [Vitest](https://vitest.dev/). To run the tests locally:

```bash
npm run test
```

Test files are located in the `tests/` directory, with examples demonstrating how to test your endpoints and database interactions.

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. Integration tests are located in the `tests/` directory.
4. For more information read the [chanfana documentation](https://chanfana.com/), [Hono documentation](https://hono.dev/docs), and [Vitest documentation](https://vitest.dev/guide/).
