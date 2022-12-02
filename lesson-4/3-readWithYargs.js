import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";

const ACCESS_LOG = "./access.log";

const __dirname = "/Users/ilya/Documents/Geekbrains/node-js/lesson-4";

const options = yargs(hideBin(process.argv))
  .usage("Usage: -p <path>")
  .options("p", {
    alias: "path",
    describe: "Path to file",
    demandOption: true,
  }).argv;

const fileName = options.path;

fs.readFile(
  path.join(__dirname, fileName),
  {
    encoding: "utf8",
  },
  (err, data) => console.log(data),
);
