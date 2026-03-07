# Pixel Board

<!-- dash-content-start -->
<p align="center">
<img width="621" height="393" alt="banner" src="https://github.com/user-attachments/assets/b1e2b13c-ad57-4c23-aa9a-8d0a7fcb4485" />
</p>
The Pixel Board is a collaborative, realtime, pixel-placing interactive game. Users can place pixels onto a board, and see live updates from others. This repository contains the backend logic, is the form of a serverless [Cloudflare Worker](https://developers.cloudflare.com/workers/) + [Durable Object](https://developers.cloudflare.com/durable-objects/). You can read more about my learning experience [here](https://www.paul-maclean.com/posts/pixel-board).

<!-- dash-content-end -->

## Architecture

The project uses a Cloudflare Worker with OpenAPI 3.1 Auto Generation and Validation using [chanfana](https://github.com/cloudflare/chanfana) for swagger integration, and [Hono](https://github.com/honojs/hono) as the client-facing server. The data source for the pixel board is a Durable Object, which caches the board state, and streams game board updates via [Partyserver](https://github.com/cloudflare/partykit.git).

<img width="3288" height="1164" alt="image" src="https://github.com/user-attachments/assets/107e3184-a1a5-4161-be70-653ae1cdf0e6" />

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
