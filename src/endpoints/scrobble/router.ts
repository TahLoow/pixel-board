import { Hono } from "hono";
import { fromHono } from "chanfana";
import { ScrobbleRead } from "./scrobbleRead";

export const scrobbleRouter = fromHono(new Hono());

scrobbleRouter.get("/", ScrobbleRead);
