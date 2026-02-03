import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { BoardModel } from "./base";

export class BoardRead extends D1ReadEndpoint<HandleArgs> {
  _meta = {
    model: BoardModel,
  };
  schema = {
    tags: ["Boards"]
  };
}
