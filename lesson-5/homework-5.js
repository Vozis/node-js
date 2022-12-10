import http from "http";
import url from "url";
import os from "os";
import cluster from "cluster";
import colors from "colors";
import fs from "fs";
import fsp from "fs/promises";
import readline from "readline";
import inquirer from "inquirer";
import path from "path";
import { Transform } from "stream";

const host = "localhost";
const port = 3001;

const list = [];
const currentDirectory = process.cwd();

// const transformLink = (arr, curUrl) => {
//   if (curUrl.endWith("/")) curUrl = curUrl.substring(0, curUrl.length - 1);

//   let li = "";

//   for (const item of arr) {
//     li += `<li><a href='${curUrl}/${item}'>${item}</a></li>`;
//   }
//   return li;
// };

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    let url = req.url.split("?")[0];
    const curPath = path.join(currentDirectory, url);

    res.write("<h1>Reader App</h1>");
    res.write(`<p>Current directory: ${curPath}</p>`);

    fs.stat(curPath, (err, stats) => {
      if (!err) {
        if (stats.isFile(curPath)) {
          const readStream = fs.createReadStream(curPath, {
            encoding: "utf-8",
          });

          readStream.on("data", (chunk) => {
            const text = `<pre>${chunk}</pre>`;

            res.write(text);
          });

          readStream.on("end", () => {
            res.end();
          });

          // readStream.pipe(res);
        } else {
          fsp
            .readdir(curPath)
            .then((files) => {
              if (url !== "/") files.unshift("..");
              return files;
            })
            .then((data) => {
              const filePath = path.join(currentDirectory, "./index.html");
              const rs = fs.createReadStream(filePath);
              const ts = new Transform({
                transform(chunk, encoding, callback) {
                  if (url.endsWith("/")) url = url.substring(0, url.length - 1);

                  let li = "";

                  for (const item of data) {
                    li += `<li><a href='${url}/${item}'>${item}</a></li>`;
                  }
                  const text = chunk.toString().replace("#links#", li);

                  this.push(text);

                  callback();
                },
              });
              rs.pipe(ts).pipe(res);
            });
        }
      } else {
        res.end("Path doesn't exist");
      }
    });
  }
});

server.listen(port, host, () =>
  console.log(`Server is running on http://${host}:${port}`),
);
