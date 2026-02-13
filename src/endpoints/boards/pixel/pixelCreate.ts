import { contentJson, D1UpdateEndpoint } from "chanfana";
import { PixelModel } from "./base";
import z from "zod";
import { AppContext, HandleArgs } from "#src/types";

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

    const stub = c.env.PIXEL_BOARD_DURABLE_OBJECT.getByName("board");

    stub.setPixel(data.params.id, data.body.position, data.body.color);

    return {
      success: true,
      result: null,
    };
  }
}
