import { D1ListEndpoint, RequestTypes, ResponseConfig } from "chanfana";
import { HandleArgs } from "../../types";
import { BoardModel } from "./base";

export class BoardList extends D1ListEndpoint<HandleArgs> {
  _meta = {
    model: BoardModel,
  };
  schema = {
    tags: ["Boards"],
  };

  searchFields = [];
  defaultOrderBy = "created_at DESC";
}
