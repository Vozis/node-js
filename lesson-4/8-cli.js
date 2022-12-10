#!/Users/ilya/.nvm/versions/node/v16.18.1/bin/node

import inquirer from "inquirer";
import fsp from "fs/promises";
import path from "path";

// const __dirname = "/Users/ilya/Documents/Geekbrains/node-js/lesson-4";

const currentDirectory = process.cwd();

fsp
  .readdir(path.join(currentDirectory))
  .then(async (indir) => {
    const list = [];
    for (const item of indir) {
      const src = await fsp.stat(item);
      // if (src.isFile()) list.push(item);
    }
    return list;
  })
  .then((choices) => {
    return inquirer
      .prompt({
        name: "fileName",
        type: "list", // input, number, confirm, rawlist, expand, checkbox, password
        message: "Choose file",
        choices,
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .then(({ fileName }) => fsp.readFile(fileName, "utf-8"))
  .then(console.log);
