import { OpenAPIRoute } from "chanfana";
import { BoardModel } from "./base";
import z from "zod";
import { AppContext, HandleArgs } from "#src/types";
import PartySocket from "partysocket";

export class PixelStream extends OpenAPIRoute<HandleArgs> {
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

    const socket = new PartySocket({
      host: "http://127.0.0.1:8787",
      party: "pixel-board-durable-object",
      room: "board",
    });

    // console.log("ready state: ");
    // console.log(socket.readyState);

    // socket.addEventListener("message", (event) => {
    //   console.log("message", event.data);
    // });

    // setInterval(() => {
    //   socket.send(`hello from ${id}`);
    // }, 1000);

    // socket.send(`hello from ${id} INIT`);

    // await new Promise((r) => setTimeout(r, 2000));

    // console.log("ready state: " + socket.readyState);

    return {
      success: true,
      result: await stub.getActiveBoard(),
    };
  }
}
