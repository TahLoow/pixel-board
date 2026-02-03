import { z } from "zod";

// -- Migration number: 0002
// CREATE TABLE IF NOT EXISTS board (
//     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
//     is_complete BOOLEAN NOT NULL DEFAULT(FALSE),
//     created_at DATETIME NOT NULL DEFAULT(GETDATE())
// );

// CREATE TABLE IF NOT EXISTS pixel (
//     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
//     board_id INTEGER NOT NULL,
//     x INTEGER NOT NULL,
//     y INTEGER NOT NULL,
//     color INTEGER NOT NULL,
//     created_at DATETIME NOT NULL DEFAULT(GETDATE()),

//     FOREIGN KEY(board_id) REFERENCES board(id)
// );

export const board = z.object({
  id: z.number().int(),
  is_complete: z.boolean(),
  created_at: z.string().datetime(),
});

export const BoardModel = {
  tableName: "board",
  primaryKeys: ["id"],
  schema: board,
  serializer: (obj: Record<string, string | number | boolean>) => {
    return {
      ...obj,
      is_complete: Boolean(obj.completed),
    };
  },
  serializerObject: board,
};

export type Board = z.infer<typeof BoardModel.schema>;