import inquirer from "inquirer";
import fsp from "fs/promises";
import path from "path";

const __dirname = "/Users/ilya/Documents/Geekbrains/node-js/lesson-4";

fsp
  .readdir(path.join(__dirname))
  .then(async (indir) => {
    const list = [];
    for (const item of indir) {
      const src = await fsp.stat(item);
      if (src.isFile()) list.push(item);
    }
    return list;
  })
  .then((choices) => {
    return inquirer.prompt({
      name: "fileName",
      type: "list", // input, number, confirm, rawlist, expand, checkbox, password
      message: "Choose file",
      choices,
    });
  })
  .then(({ fileName }) => fsp.readFile(fileName, "utf-8"))
  .then(console.log);
