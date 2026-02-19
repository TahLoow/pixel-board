import { Context } from "hono";
import { sign } from "hono/jwt";
import { verify } from "hono/jwt";

type SiteverifyApiResponse = {
  success: boolean;
  error: string;
  challenge_ts: string;
  hostname: string;
  ["error-codes"]: string[];
  action: string;
  cdata: any;
};

export class AuthService {
  // Generates a JWT from the turnstile token, signed with the private key
  async generateJwt(
    c: Context,
    turnstileToken: string,
  ): Promise<string | undefined> {
    const secret = c.env.TURNSTILE_SECRET_KEY;
    const ip = c.req.header("CF-Connecting-IP");

    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: turnstileToken,
          remoteip: ip,
        }),
      },
    );

    const outcome = (await result.json()) as SiteverifyApiResponse;

    if (!outcome.success) {
      return undefined;
    }

    // Sign payload
    const jwt = await sign(
      { validation: JSON.stringify(outcome) },
      c.env.JWT_PRIVATE_KEY,
    );

    return jwt;
  }

  // Determines whether a JWT exists + was signed by the server
  authenticateJwt = async (
    sessionCookie: string | undefined,
    jwtPrivateKey: string,
  ): Promise<boolean> => {
    if (!sessionCookie) {
      return false;
    }

    const payloadVerified = await verify(sessionCookie, jwtPrivateKey);
    if (!payloadVerified) {
      return false;
    }

    return true;
  };
}
