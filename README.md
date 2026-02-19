# Pixel Board Worker

<!-- dash-content-start -->

This project is a collaborative, realtime, pixel-placing interactive game. Users can place pixels onto a board, and see live updates from others. The project uses a Cloudflare Worker with OpenAPI 3.1 Auto Generation and Validation using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono). This project also uses a Cloudflare Durable Object to cache and stream game board states.

<!-- dash-content-end -->

## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm clean install
   ```
2. Run the project locally, which will start the durable object, backend, and documentation hosting.
   ```bash
   npx wrangler dev
   ```
3. Push Worker/Durable Object code to the Cloudflare network. ⚠️ This makes the changes live on the public internet
   ```bash
   npx wrangler deploy
   ```
4. Stream live logs from the production Worker to verify everything is running smoothly.
   ```bash
   npx wrangler tail
   ```

## Project structure

1. The main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. Durable object code is in `src/durable-object`.
4. For more information read the [chanfana documentation](https://chanfana.com/), [Hono documentation](https://hono.dev/docs), and [Vitest documentation](https://vitest.dev/guide/).

## Durable Object + Party Server

The Durable Object is a globally unique serverless app. Due to its global uniqueness, it can reliably store and broadcast websocket connections using **PartyServer**. PartyServer/websocket requests are initially made to the Hono server. The `src/index.ts` file exports a `fetch` function, which delegates partyserver requests to the Durable Object, and all others to the Chanfana endpoints.

The Durable Object also, principally, handles CRUD logic directly with the database.
