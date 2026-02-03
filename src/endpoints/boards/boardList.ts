import { D1ListEndpoint, RequestTypes, ResponseConfig } from "chanfana";
import { HandleArgs } from "../../types";
import { BoardModel } from "./base";
import { ExternalDocumentationObject, ParameterObject, ReferenceObject, RequestBodyObject, CallbacksObject, SecurityRequirementObject, ServerObject } from "openapi3-ts/oas30";
import { ExternalDocumentationObject, ParameterObject, ReferenceObject, RequestBodyObject, CallbacksObject, SecurityRequirementObject } from "openapi3-ts/oas31";

export class BoardList extends D1ListEndpoint<HandleArgs> {
  _meta = {
    model: BoardModel,
  };
  schema = {
    tags: ["Boards"]
  };

  searchFields = [];
  defaultOrderBy = "created_at DESC";
}
