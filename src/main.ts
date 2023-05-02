import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connection from "./common/database";
import { logger } from "./common/logger/logger";
import { NonEmptyArray, buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getDataFromFileName } from "./common/config/structure";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

async function main() {
  try {
    const schema = await buildSchema({
      resolvers: [
        ...(getDataFromFileName("resolvers") as NonEmptyArray<Function>),
      ],
      emitSchemaFile: true,
      validate: false,
    });

    const server = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    });

    await connection.sync();
    app.listen(port, () => {
      console.log(
        `⚡️ [server]: Server is running at http://localhost:${port}`
      );
      console.log(
        `⚡️ [server]: Graphql is running at http://localhost:${port}/graphql`
      );
    });
    await server.start();

    server.applyMiddleware({ app });
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
