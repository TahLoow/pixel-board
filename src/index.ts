import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { boardsRouter } from "./endpoints/boards/router";
import { cors } from "hono/cors";
import { partyserverMiddleware } from "hono-party";
import { routePartykitRequest } from "partyserver";

export {
  PixelBoardDurableObject,
  // fetch,
} from "./durable-object/PixelBoardDurableObject";

export type ChatMessage = {
  id: string;
  content: string;
  user: string;
  role: "user" | "assistant";
};

export type Message =
  | {
      type: "add";
      id: string;
      content: string;
      user: string;
      role: "user" | "assistant";
    }
  | {
      type: "update";
      id: string;
      content: string;
      user: string;
      role: "user" | "assistant";
    }
  | {
      type: "all";
      messages: ChatMessage[];
    };

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.use(
  "/*", // Apply CORS to all routes
  cors({
    origin: (origin) => {
      if (origin === "http://localhost:5173") return origin; // Allow requests from frontend localhost

      // Allow requests from vercel previews
      const isPreview =
        /^https:\/\/career-git-.*-pauls-projects-e01676e5\.vercel\.app$/.test(
          origin,
        );
      if (isPreview) return origin;
      return null;
    },
    allowHeaders: ["Content-Type", "Authorization", "User-Agent"], // Required headers
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.onError((err, c) => {
  if (err instanceof ApiException) {
    // If it's a Chanfana ApiException, let Chanfana handle the response
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode,
    );
  }

  console.error("Global error handler caught:", err); // Log the error if it's not known

  // For other errors, return a generic 500 response
  return c.json(
    {
      success: false,
      errors: [{ code: 7000, message: "Internal Server Error" }],
    },
    500,
  );
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Pixel Board API",
      version: "2.0.0",
      description: "API page for a draw-by-pixel mini app.",
    },
  },
});

// Register Boards Sub router
openapi.route("/boards", boardsRouter);

// With custom routing
app.use(
  "*",
  partyserverMiddleware({
    options: {
      prefix: "/party/parties/pixel-board-durable-object/board", // Handles /party/* routes only
    },
  }),
);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Route partyserver requests, for websockets
    const partyResponse = await routePartykitRequest(request, env);

    if (partyResponse) {
      return partyResponse;
    }

    // If it's not a party request, let Hono handle it
    return app.fetch(request, env, ctx);
  },
};
