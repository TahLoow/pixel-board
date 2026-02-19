import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BoardRead } from "./boardRead";
import { PixelCreate } from "./pixel/pixelCreate";

export const boardsRouter = fromHono(new Hono());

boardsRouter.get("/", BoardRead);
boardsRouter.post("/:id/pixels", PixelCreate);
