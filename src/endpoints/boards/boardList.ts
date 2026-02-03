import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { BoardModel } from "./base";

export class BoardList extends D1ListEndpoint<HandleArgs> {
  _meta = {
    model: BoardModel,
  };

  searchFields = [];
  defaultOrderBy = "created_at DESC";
}
