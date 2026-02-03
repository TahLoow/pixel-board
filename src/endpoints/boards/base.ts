import { z } from "zod";

export const board = z.object({
  id: z.number().int(),
  is_complete: z.boolean(),
  width: z.number().int(),
  height: z.number().int(),
  created_at: z.string().datetime(),
});

export const BoardModel = {
  tableName: "board",
  primaryKeys: ["id"],
  schema: board,
  serializer: (obj: Record<string, any>) => {
    return {
      ...obj,
      is_complete: Boolean(obj.completed),
    };
  },
  serializerObject: board,
};

export type Board = z.infer<typeof BoardModel.schema>;
