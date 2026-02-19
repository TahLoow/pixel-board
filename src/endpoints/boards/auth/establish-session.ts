import { AuthService } from "#src/services/auth/auth-service";
import { OpenAPIRoute } from "chanfana";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import * as z from "zod";

export class EstablishSession extends OpenAPIRoute {
  schema = {
    summary: "Verify Turnstile token and start session",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              token: z.string().describe("The cf-turnstile-response token"),
            }),
          },
        },
      },
    },
    responses: {
      "200": { description: "Session established" },
      "401": { description: "Verification failed" },
    },
  };

  async handle(c: Context) {
    const { token } = await c.req.json();

    const authService = new AuthService();
    const jwt = await authService.generateJwt(c, token);

    if (!jwt) {
      return c.json({ error: "Verification failed" }, 401);
    }

    const cookieOptions: CookieOptions = {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: Number(c.env.JWT_MAX_AGE), // Session valid for 1 hour
      sameSite: "None",
      domain: undefined,
    };

    // Would be nice to update sameSite. Can't differentiate prod/test, currently
    // const hostname = new URL(c.req.url).hostname;

    // if (c.get("isProduction")) {
    //   cookieOptions.domain = hostname.substring(hostname.indexOf("."));
    //   // cookieOptions.sameSite = "Strict";
    // }

    // Turnstile passed, create a session cookie.
    setCookie(c, "turnstile_session", jwt, cookieOptions);

    return { message: "Session established" };
  }
}
