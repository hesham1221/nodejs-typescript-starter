import pino from "pino";
import expressPino from "express-pino-logger";
import * as fs from "fs";
import * as path from "path";
import { env } from "../config/env";
import * as uuid from "uuid";

if (env.NODE_ENV === "production") {
  if (!fs.existsSync(path.join(process.cwd(), "logs")))
    fs.mkdirSync(path.join(process.cwd(), "logs"));
}

export const logger = expressPino({
  name: "Pino",
  level: env.NODE_ENV !== "production" ? "warn" : "info",
  timestamp: () => `, "Time": "${new Date().toISOString()}"`,
  redact: ["password", "headers.cookie"],
  safe: true,
  enabled: env.NODE_ENV !== "test",
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    crlf: true,
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  useLevel: env.NODE_ENV !== "production" ? "debug" : "info",
  genReqId: (req) => req.id || uuid.v4(),
  autoLogging: false,
  ...(env.NODE_ENV === "production" && {
    stream: fs.createWriteStream(path.join(process.cwd(), "logs/logs.log")),
  }),
});
