import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import readline from "readline";
import inquirer from "inquirer";

const currentDirectory = process.cwd();

const getFiles1 = (dirPath) => {
  return fsp
    .readdir(dirPath, { withFileTypes: true })
    .then((list) => {
      return inquirer.prompt([
        {
          name: "fileName",
          type: "list",
          message: "Choose file: ",
          choices: list,
        },
      ]);
    })
    .then(async ({ fileName }) => {
      const fullPathToFile = path.join(dirPath, fileName);
      const src = await fsp.stat(fullPathToFile);
      if (!src.isFile()) {
        return getFiles1(fullPathToFile);
      }
      return fullPathToFile;
    });
};

const getAnswer = (fullPath, searchRequest) => {
  const readStream = fs.createReadStream(path.join(fullPath), "utf-8");

  const rl = readline.createInterface({
    input: readStream,
    output: process.stdout,
    crlfDelay: Infinity,
    terminal: false,
  });

  rl.on("line", (line) => {
    if (line.includes(searchRequest)) {
      console.log(line);
    }
  });
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  crlfDelay: Infinity,
});

const getFiles = (result) => {
  return new Promise((resolve) => {
    rl.question("Please enter the path to the file: ", (dirPath) => {
      result = getFiles1(dirPath);
      resolve(result);
    });
  });
};

const getAnwer = (result) => {
  return new Promise((resolve) => {
    rl.question("Enter search request: ", (search) => {
      const readStream = fs.createReadStream(path.join(result), "utf-8");

      const rl = readline.createInterface({
        input: readStream,
        output: process.stdout,
        crlfDelay: Infinity,
        terminal: false,
      });

      rl.on("line", (line) => {
        if (line.includes(search)) {
          console.log(line);
        }
      });
      resolve(result);
    });
  });
};

getFiles()
  .then(getAnswer)
  .then((info) => {
    console.log(info);
  });

// const question = (question) => {
//   return new Promise((resolve, reject) => {
//     rl.question(question, (answer) => resolve(answer));
//   });
// };

// const main = () => {
//   const dirName = question("Please enter the path to the file: ");

//   const fullPath = getFiles(dirName);

//   const searchRequest = question("Enter search request: ");

//   getAnswer(fullPath, searchRequest);

//   rl.close();
// };

// rl.on("close", () => process.exit(0));

// main();

// ================================================================================
