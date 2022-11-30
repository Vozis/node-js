import readline from "readline";
import fs from "fs";
import path from "path";

// const ACCESS_LOG = "./access.log";

const __dirname = "/Users/ilya/Documents/Geekbrains/node-js/lesson-4";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Please enter the path to the file: ", (fileName) => {
  fs.readFile(
    path.join(__dirname, fileName),
    {
      encoding: "utf8",
    },
    (err, data) => {
      console.log(data);
      rl.close();
    },
  );
});

rl.on("close", () => process.exit(0));
