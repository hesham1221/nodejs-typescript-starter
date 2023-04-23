import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connection from "./common/database";
import { logger } from "./common/logger/logger";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger)

async function main() {
  try {
    await connection.sync();
    app.listen(port, () => {
      console.log(
        `⚡️ [server]: Server is running at http://localhost:${port}`
      );
    });
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
