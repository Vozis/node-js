import fs from "fs";
import path from "path";

const ACCESS_LOG = "./access.log";

const fileName = process.argv[2];
const __dirname = "/Users/ilya/Documents/Geekbrains/node-js/lesson-4";

fs.readFile(
  path.join(__dirname, fileName),
  {
    encoding: "utf8",
  },
  (err, data) => console.log(data),
);
