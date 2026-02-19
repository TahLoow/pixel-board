import { ApiException, fromHono } from "chanfana";
import { Context, Hono, Next } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { boardsRouter } from "./endpoints/boards/router";
import { cors } from "hono/cors";
import { routePartykitRequest } from "partyserver";
import { HTTPException } from "hono/http-exception";
import { EstablishSession } from "./endpoints/boards/auth/establish-session";
import { authGuard } from "./services/auth/auth-guard";

export { PixelBoardDurableObject } from "./durable-object/PixelBoardDurableObject";

type Variables = {
  isLocalEnvironment: boolean;
};

// Start a Hono app
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use(
  "/*", // Apply CORS to all routes
  cors({
    origin: (origin) => {
      if (origin === "http://localhost:5173") return origin; // Allow requests from frontend localhost

      // Allow requests from vercel previews
      const isPreview =
        /^https:\/\/career-.*-pauls-projects-e01676e5\.vercel\.app$/.test(
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
  } else if (err instanceof HTTPException) {
    return c.json({ success: false, error: err.message }, err.status);
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

// Protect endpoints with auth
openapi.use("*", async (c: Context, next: Next) => {
  const host = c.req.header("host");

  const isLocal = host?.includes("localhost") || host?.includes("127.0.0.1");
  const isProduction = !isLocal && !host?.includes("vercel.app");
  const isDemo = !isLocal && !isProduction;
  // console.log(host);

  // console.log("isLocal: " + isLocal);
  // console.log("isProduction: " + isProduction);
  // console.log("isDemo: " + isDemo);

  // c.set("isLocalEnvironment", isLocal);
  // c.set("isProduction", isProduction);
  // c.set("isDemo", isDemo);
  return next();
});
openapi.use("*", authGuard);

// Register routes/routers
openapi.route("/boards", boardsRouter);
openapi.post("/auth/verify", EstablishSession);

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
