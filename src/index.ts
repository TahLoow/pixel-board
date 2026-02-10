import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { boardsRouter } from "./endpoints/boards/router";
import { cors } from "hono/cors";
import { DurableObject } from "cloudflare:workers";
import { JSONValue } from "hono/utils/types";

import {
  type Connection,
  Server,
  type WSMessage,
  routePartykitRequest,
} from "partyserver";

export type ChatMessage = {
  id: string;
  content: string;
  user: string;
  role: "user" | "assistant";
};

export type Message =
  | {
      type: "add";
      id: string;
      content: string;
      user: string;
      role: "user" | "assistant";
    }
  | {
      type: "update";
      id: string;
      content: string;
      user: string;
      role: "user" | "assistant";
    }
  | {
      type: "all";
      messages: ChatMessage[];
    };

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.use(
  "/*", // Apply CORS to all routes
  cors({
    origin: (origin) => {
      if (origin === "http://localhost:5173") return origin; // Allow requests from frontend localhost

      // Allow requests from vercel previews
      const isPreview =
        /^https:\/\/career-git-.*-pauls-projects-e01676e5\.vercel\.app$/.test(
          origin,
        );
      if (isPreview) return origin;
      return null;
    },
    allowHeaders: ["Content-Type", "Authorization", "User-Agent"], // Required headers
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.onError((err, c) => {
  if (err instanceof ApiException) {
    // If it's a Chanfana ApiException, let Chanfana handle the response
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode,
    );
  }

  console.error("Global error handler caught:", err); // Log the error if it's not known

  // For other errors, return a generic 500 response
  return c.json(
    {
      success: false,
      errors: [{ code: 7000, message: "Internal Server Error" }],
    },
    500,
  );
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Pixel Board API",
      version: "2.0.0",
      description: "API page for a draw-by-pixel mini app.",
    },
  },
});

// Register Boards Sub router
openapi.route("/boards", boardsRouter);

// Export the Hono app
export default app;

// Define methods for a Durable Object
// export class PixelBoardDurableObject extends DurableObject<Env> {
//   constructor(ctx: DurableObjectState, env: Env) {
//     super(ctx, env);
//   }

//   async sayHello(request: Request): Promise<JSONValue> {
//     console.log(request);
//     return "Hello from Durable Object!";
//   }
// }

export class PixelBoardDurableObject extends Server<Env> {
  static options = { hibernate: true };

  messages = [] as ChatMessage[];

  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }

  onStart() {
    // this is where you can initialize things that need to be done before the server starts
    // for example, load previous messages from a database or a service

    // const sql = fs.readFileSync('init_database.sql').toString();

    console.log("PixelBoardDurableObject started");

    // create the pixels table if it doesn't exist
    // this.ctx.storage.sql.exec(
    //   `CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, user TEXT, role TEXT, content TEXT)`,
    // );

    // // load the messages from the database
    // this.messages = this.ctx.storage.sql
    //   .exec(`SELECT * FROM messages`)
    //   .toArray() as ChatMessage[];
  }

  onConnect(connection: Connection) {
    console.log("Connected to PixelBoardDurableObject");

    connection.send(
      JSON.stringify({
        type: "all",
        messages: [],
      } satisfies Message),
    );

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
}
