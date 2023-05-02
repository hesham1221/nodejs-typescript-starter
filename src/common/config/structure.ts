import * as fs from "fs";
import * as path from "path";
import { NonEmptyArray } from "type-graphql";
import { capitalizeFirstLetter } from "../utils/helpers";
import { StructureFiles } from "../types/structureFiles";

const paths = {
  resolversPath: path.join(process.cwd(), "src", "resolvers"),
  modelsPath: path.join(process.cwd(), "src", "models"),
  routesPath: path.join(process.cwd(), "src", "routes"),
  servicesPath: path.join(process.cwd(), "src", "services"),
};
const data = {
  resolvers: fs.readdirSync(paths.resolversPath),
  models: fs.readdirSync(paths.modelsPath),
  routes: fs.readdirSync(paths.routesPath),
  services: fs.readdirSync(paths.servicesPath),
};
export function getDataFromFileName(
  name: StructureFiles
): NonEmptyArray<Function> | Array<Function> {
  const returnedData = [];
  for (let fileName of data[name]) {
    if (fileName === "index.ts" || !fileName.endsWith("ts")) continue;
    let fileData = require(path.join(paths[`${name}Path`], fileName));
    returnedData.push(fileData);
  }
  return returnedData.map((dataFiles, i) => {
    const className =
      capitalizeFirstLetter(data[name][i].split(".")[0]) +
      capitalizeFirstLetter(name.endsWith("s") ? name.slice(0, -1) : name);
    return dataFiles[`${className}`];
  });
}
