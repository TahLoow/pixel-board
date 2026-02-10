import { D1ReadEndpoint } from "chanfana";
import { AppContext, HandleArgs } from "../../types";
import { Board, BoardModel } from "./base";
import z from "zod";
import PartySocket from "partysocket";

export class BoardRead extends D1ReadEndpoint<HandleArgs> {
  _meta = {
    model: BoardModel,
  };
  schema = {
    tags: ["Boards"],
    request: {
      params: z.object({
        id: z.number().describe("The ID of the board"),
      }),
    },
  };

  public async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();

    // 1. Access the D1 binding from the Hono context
    const db = c.env.DB;

    // 2. Execute your SQL query
    const boardQuery =
      "SELECT id, width, height FROM board WHERE id = ? AND is_complete = FALSE";
    const boardResult = await db
      .prepare(boardQuery)
      .bind(data.params.id) // Bind parameters to prevent SQL injection
      .first<Board>();

    if (!boardResult) {
      throw new Error("Board does not exist");
    }

    // 2. Execute your SQL query
    const pixelQuery =
      "SELECT position, color FROM (" +
      "SELECT position, color, max(created_at) FROM pixel WHERE board_id = ? GROUP BY position" +
      ")";
    const pixelResult = await db
      .prepare(pixelQuery)
      .bind(data.params.id) // Bind parameters to prevent SQL injection
      .all();

    const stub = c.env.PIXEL_BOARD_DURABLE_OBJECT.getByName(
      new URL(c.req.url).pathname,
    );

    // const greeting = await stub;

    return {
      success: true,
      result: {
        id: data.params.id,
        pixels: pixelResult.results,
        width: boardResult.width,
        height: boardResult.height,
      },
    };
  }
}
