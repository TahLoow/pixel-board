import { Hono } from "hono";
import { fromHono } from "chanfana";
import { BoardRead } from "./boardRead";
import { BoardList } from "./boardList";
// import { BoardUpdate } from "./boardUpdate";

export const boardsRouter = fromHono(new Hono());

boardsRouter.get("/", BoardList);
boardsRouter.get("/:id", BoardRead);
// boardsRouter.post("/boards/:id/pixels", BoardUpdate);
