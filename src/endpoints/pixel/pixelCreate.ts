import { contentJson, D1UpdateEndpoint } from "chanfana";
import { PixelModel } from "./base";
import { AppContext, HandleArgs } from "../../types";
import z from "zod";

export class PixelCreate extends D1UpdateEndpoint<HandleArgs> {
  _meta = {
    model: PixelModel,
    fields: PixelModel.schema.pick({
      position: true,
    }),
  };

  schema = {
    tags: ["Pixels"],
    request: {
      params: z.object({
        id: z.number().describe("The ID of the board"),
      }),
      body: contentJson(
        z.object({
          position: z.number().int(),
          color: z.number().int(),
        }),
      ),
    },
  };

  public async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();

    // 1. Access the D1 binding from the Hono context
    const db = c.env.DB;

    const query = `
      INSERT INTO pixel (board_id, position, color) 
      VALUES (?, ?, ?)
    `;

    const response = await db
      .prepare(query)
      .bind(data.params.id, data.body.position, data.body.color)
      .run();

    return {
      success: response.success,
      result: null,
    };
  }
}
