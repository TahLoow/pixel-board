import { contentJson, OpenAPIRoute } from "chanfana";
import { PixelModel } from "./base";
import z from "zod";
import { HandleArgs } from "#src/types";
import { Context } from "hono";

export class PixelCreate extends OpenAPIRoute<HandleArgs> {
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

  public async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();

    const stub = c.env.PIXEL_BOARD_DURABLE_OBJECT.getByName("board");
    await stub.setPixel(data.params.id, data.body.position, data.body.color);

    return {
      success: true,
      result: null,
    };
  }
}
