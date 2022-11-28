import fs from "fs";
import readline from "readline";
import { Transform } from "stream";

const ACCESS_LOG = "./access_tmp.log";

const requests = ["34.48.240.111", "89.123.1.41"];

// Способ через readline

const rl = readline.createInterface({
  input: fs.createReadStream(ACCESS_LOG, {
    encoding: "utf8",
  }),
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  requests.forEach((ip) => {
    const fileName = `${ip}_request.log`;
    const writeStream = fs.createWriteStream(fileName, {
      flags: "a",
    });
    if (line.includes(ip)) {
      writeStream.write(line + "\n");
    }
  });
});

// Способ через потоки и Transform

const createIpFiles = () => {
  const readStream = fs.createReadStream(ACCESS_LOG, {
    encoding: "utf8",
  });

  requests.forEach((ip) => {
    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        const logsArray = Array.from(chunk.toString().split("\n")).filter(
          (item) => item.includes(ip),
        );

        // console.log("chunk");
        // console.log(logsArray);

        const data = logsArray.join("\n");

        this.push(data);
        callback();
      },
    });

    const fileName = `${ip}_request.log`;
    const writeStream = fs.createWriteStream(fileName);

    readStream
      .pipe(transformStream)
      .pipe(writeStream)
      .on("end", () => {
        console.log("files were created");
      });
  });
};

createIpFiles();
