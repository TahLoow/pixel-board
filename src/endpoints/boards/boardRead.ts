import { OpenAPIRoute } from "chanfana";
import { BoardModel } from "./base";
import z from "zod";
import { AppContext, HandleArgs } from "#src/types";

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

  public async handle(c: AppContext) {
    // const data = await this.getValidatedData<typeof this.schema>();

    const stub = c.env.PIXEL_BOARD_DURABLE_OBJECT.getByName("board");

    return {
      success: true,
      result: await stub.getActiveBoard(),
    };
  }
}
