// @/connection.ts
import { ModelCtor, Sequelize } from "sequelize-typescript";
import { env } from "../config/env";
import { getDataFromFileName } from "../config/structure";

const connection = new Sequelize({
  dialect: "postgres",
  host: env.DB_HOST,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  logging: false,
  models: [...(getDataFromFileName("models") as ModelCtor[])],
  sync: {
    alter: true, // Note: Do not use this in production use migrations instead
  },
});

export default connection;
