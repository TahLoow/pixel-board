import { Server } from "partyserver";
import { starterBoard } from "./starter-board";
import { Board } from "#src/endpoints/boards/base";

type Message = { boardId: number; position: number; color: number };

interface BoardStatePixel {
  position: number;
  color: number;
}

interface BoardState {
  id: number;
  width: number;
  height: number;
  pixels: BoardStatePixel[];
}

export class PixelBoardDurableObject extends Server<Env> {
  static options = { hibernate: false };

  board!: BoardState;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    console.log("PixelBoardDurableObject started");

    // Initialize sqlite DB
    this.createBoardTable();
    this.createPixelTable();

    // Add initial data if this is a fresh DB
    this.seedBoard();

    // Initialize DO state
    this.cacheBoard();
  }

  createBoardTable() {
    this.ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS board (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      is_complete BOOLEAN NOT NULL DEFAULT(FALSE),
      created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    );`);
  }

  createPixelTable() {
    this.ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS pixel (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      board_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      color INTEGER NOT NULL,

      created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      FOREIGN KEY(board_id) REFERENCES board(id)
    );`);
  }

  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }

  seedBoard() {
    const getAnyBoardSql =
      "SELECT id, width, height FROM board WHERE is_complete = FALSE ORDER BY created_at DESC LIMIT 1";
    const boards = this.ctx.storage.sql.exec(getAnyBoardSql).toArray();

    if (!boards.length) {
      this.ctx.storage.sql.exec(starterBoard);
      console.log("No boards in DB; seeding board");
    }
  }

  onStart() {
    console.log("Partyserver started");
  }

  private async cacheBoard() {
    const boardQuery =
      "SELECT id, width, height FROM board WHERE is_complete = FALSE ORDER BY created_at DESC LIMIT 1";
    const activeBoard = this.ctx.storage.sql
      .exec(boardQuery)
      .toArray()?.[0] as unknown as Board;

    // Get pixels for the board
    const getBoardSql =
      "SELECT position, color FROM (" +
      "SELECT position, color, max(created_at) FROM pixel WHERE board_id = ? GROUP BY position" +
      ")";
    const pixels = this.ctx.storage.sql
      .exec(getBoardSql, activeBoard.id)
      .toArray() as unknown as BoardStatePixel[];

    this.board = {
      id: activeBoard.id,
      width: activeBoard.width,
      height: activeBoard.height,
      pixels,
    };
  }

  getActiveBoard() {
    return this.board;
  }

  async setPixel(boardId: number, position: number, color: number) {
    if (position > this.board.height * this.board.width - 1) {
      throw new Error("Pixel placement exceeds board size");
    }

    const setPixelQuery = `
      INSERT INTO pixel (board_id, position, color) 
      VALUES (?, ?, ?)
    `;

    const response = this.ctx.storage.sql.exec(
      setPixelQuery,
      boardId,
      position,
      color,
    );

    this.cacheBoard();

    this.broadcast(JSON.stringify({ boardId, position, color }));

    return response.rowsWritten > 0;
  }
}
