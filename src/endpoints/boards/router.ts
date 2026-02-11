import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BoardRead } from "./boardRead";
import { PixelCreate } from "./pixel/pixelCreate";
import { PixelStream } from "./boardStream";

export const boardsRouter = fromHono(new Hono());

// boardsRouter.get("/", BoardList);
boardsRouter.get("/", BoardRead);
boardsRouter.post("/:id/pixels", PixelCreate);
boardsRouter.get("/:id/pixels", PixelStream);
