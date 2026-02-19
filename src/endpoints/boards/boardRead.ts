import { OpenAPIRoute } from "chanfana";
import { BoardModel } from "./base";
import z from "zod";
import { HandleArgs } from "#src/types";
import { Context } from "hono";

export class BoardRead extends OpenAPIRoute<HandleArgs> {
  _meta = {
    model: BoardModel,
  };
  schema = {
    tags: ["Boards"],
    request: {
      query: z.object({
        // id: z.number().optional().describe("The ID of the board"),
      }),
    },
  };

  public async handle(c: Context) {
    // Process the request
    const stub = c.env.PIXEL_BOARD_DURABLE_OBJECT.getByName("board");

    return {
      success: true,
      result: await stub.getActiveBoard(),
    };
  }
}
