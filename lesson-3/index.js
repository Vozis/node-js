"use strict";

import fs, { ReadStream } from "fs";
import { Transform } from "stream";

const ACCESS_LOG = "./access.log";

// const data = fs.readFileSync(ACCESS_LOG, {
//   encoding: "utf-8",
// });
// console.log(data);

// fs.readFile(ACCESS_LOG, "utf-8", (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });

// fs.readFile(ACCESS_LOG, "utf-8")
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

const requests = [
  '127.0.0.1 - - [30/Jan/2021:11:10:15 -0300] "GET /sitemap.xml HTTP/1.1" 200 0 "-" "curl/7.47.0',
  '127.0.0.1 - - [30/Jan/2021:11:11:20 -0300] "POST /foo HTTP/1.1" 200 0 "-" "curl/7.47.0',
];

// fs.writeFile(
//   ACCESS_LOG,
//   requests[1] + "\n",
//   {
//     encoding: "utf8",
//     flag: "a",
//   },
//   (err) => {
//     console.log(err);
//   },
// );

// fs.appendFile(ACCESS_LOG, requests[0] + "\n", (err) => {
//   console.log(err);
// });

// const readStream = fs.createReadStream(ACCESS_LOG, {
//   // start: 1024,
//   // end: 2048,
//   // flags: "",
//   encoding: "utf8",
//   highWaterMark: 128,
// });

// readStream.on("data", (chunk) => {
//   console.log("chunk: ", chunk);
// });

// const writeStream = fs.createWriteStream(ACCESS_LOG, {
//   encoding: "utf8",
//   flags: "a",
// });

// requests.forEach((logString) => {
//   writeStream.write(logString + "\n");
// });

const payedAccount = false;

const readStream = fs.createReadStream(ACCESS_LOG);
const tStream = new Transform({
  transform(chunk, encoding, callback) {
    if (!payedAccount) {
      const transformedChunk = chunk
        .toString()
        .replace(/\d+\.\d+\.\d+\.\d+/g, "[HIDDEN IP]");

      this.push(transformedChunk);
    } else this.push(chunk);

    callback();
  },
});

readStream.pipe(tStream).pipe(process.stdout);
