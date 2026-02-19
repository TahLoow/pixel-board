import { Next } from "hono";
import { getCookie } from "hono/cookie";
import { Context } from "hono";
import { AuthService } from "#src/services/auth/auth-service";

export const authGuard = async (c: Context, next: Next) => {
  if (c.req.path === "/auth/verify") {
    await next();
    return;
  }

  const authService = new AuthService();
  const result = await authService.authenticateJwt(
    getCookie(c, "turnstile_session"),
    c.env.JWT_PRIVATE_KEY,
  );

  if (!result) {
    return c.json({ error: "Turnstile verification required" }, 403);
  }

  await next();
};
