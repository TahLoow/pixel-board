import { z } from "zod";

export const pixel = z.object({
  id: z.number().int(),
  board_id: z.number().int(),
  position: z.number().int(),
  color: z.number().int(),
  created_at: z.string().datetime(),
});

export const PixelModel = {
  tableName: "board",
  primaryKeys: ["id"],
  schema: pixel,
  serializerObject: pixel,
};

export type Board = z.infer<typeof PixelModel.schema>;
