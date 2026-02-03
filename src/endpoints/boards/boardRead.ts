import { D1ReadEndpoint } from "chanfana";
import { AppContext, HandleArgs } from "../../types";
import { BoardModel } from "./base";
import z from "zod";

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
      .first();

    if (!boardResult) {
      throw new Error("Board does not exist");
    }

    // 2. Execute your SQL query
    const pixelQuery = "SELECT x, y, color FROM pixel WHERE board_id = ?";
    const pixelResult = await db
      .prepare(pixelQuery)
      .bind(data.params.id) // Bind parameters to prevent SQL injection
      .all();

    console.log(pixelResult);
    return {
      id: data.params.id,
      pixels: pixelResult.results,
      // width: ,
      // height: ,
    };
  }
}
