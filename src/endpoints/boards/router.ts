import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BoardRead } from "./boardRead";
import { BoardList } from "./boardList";
import { PixelCreate } from "./pixel/pixelCreate";

export const boardsRouter = fromHono(new Hono());

boardsRouter.get("/", BoardList);
boardsRouter.get("/:id", BoardRead);
boardsRouter.post("/:id/pixels", PixelCreate);
