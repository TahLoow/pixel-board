import type { Context } from "hono";

export type HandleArgs = [Context<{ Bindings: Env }>];
