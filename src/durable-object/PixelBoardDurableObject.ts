import { Connection, Server, WSMessage } from "partyserver";
import { ChatMessage, Message } from "..";
import { starterBoard } from "./starter-board";
import { Board } from "#src/endpoints/boards/base";

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

  messages = [] as ChatMessage[];

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
    console.log("Broadcastingggg");
    this.broadcast(JSON.stringify(message), exclude);
  }

  seedBoard() {
    const getAnyBoardSql =
      "SELECT id, width, height FROM board WHERE is_complete = FALSE ORDER BY created_at DESC LIMIT 1";
    const boards = this.ctx.storage.sql.exec(getAnyBoardSql).toArray();

    if (!boards.length) {
      this.ctx.storage.sql.exec(starterBoard);
      console.log("Seeded board");
    } else {
      console.log("Did not seed board; board exists in DB");
    }
  }

  onStart() {
    console.log("Server started");
  }

  onConnect(connection: Connection) {
    console.log("Connected to PixelBoardDurableObject");

    // connection.send(
    //   JSON.stringify({
    //     type: "all",
    //     messages: [],
    //   } satisfies Message),
    // );

    // connection.send(
    //   JSON.stringify({
    //     type: "all",
    //     messages: this.messages,
    //   } satisfies Message),
    // );
  }

  saveMessage(message: ChatMessage) {
    console.log("Saving message:");
    // check if the message already exists
    // const existingMessage = this.messages.find((m) => m.id === message.id);
    // if (existingMessage) {
    //   this.messages = this.messages.map((m) => {
    //     if (m.id === message.id) {
    //       return message;
    //     }
    //     return m;
    //   });
    // } else {
    //   this.messages.push(message);
    // }

    // this.ctx.storage.sql.exec(
    //   `INSERT INTO messages (id, user, role, content) VALUES ('${
    //     message.id
    //   }', '${message.user}', '${message.role}', ${JSON.stringify(
    //     message.content,
    //   )}) ON CONFLICT (id) DO UPDATE SET content = ${JSON.stringify(
    //     message.content,
    //   )}`,
    // );
  }

  onMessage(connection: Connection, message: WSMessage) {
    console.log("Message received");
    // let's broadcast the raw message to everyone else
    // this.broadcast(message);

    // // let's update our local messages store
    // const parsed = JSON.parse(message as string) as Message;
    // if (parsed.type === "add" || parsed.type === "update") {
    //   this.saveMessage(parsed);
    // }
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

    return response.rowsWritten > 0;
  }

  logTables() {
    console.log(5);
    console.log(
      this.ctx.storage.sql
        .exec(
          "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
        )
        .toArray(),
    );
  }
}
