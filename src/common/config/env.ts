import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env");

if (!fs.existsSync(envPath)) {
  // check if env.example exists and copy it to .env
  const envExamplePath = path.join(process.cwd(), ".env.example");
  if (fs.existsSync(envExamplePath)) fs.copyFileSync(envExamplePath, envPath);
  // otherwise create an empty .env file
  else fs.writeFileSync(envPath, "");
}

export const env = dotenv.parse(fs.readFileSync(envPath));
