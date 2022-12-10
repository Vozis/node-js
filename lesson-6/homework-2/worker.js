import { workerData, parentPort } from "worker_threads";
import http from "http";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { Server } from "socket.io";
import { Transform } from "stream";

const host = "localhost";
const { portOfset } = workerData;
const port = 3000 + portOfset;
const currentDirectory = process.cwd();

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

            parentPort.on("message", (text) => {
              console.log(text);
            });
            // res.write(text);
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
                    li += `<li class="file"><button type="button" class="btn">${item}</button></li>`;
                  }
                  const text = chunk.toString().replace("#links#", li);

                  this.push(text);

                  callback();
                },
              });

              rs.pipe(ts).pipe(res);
            });
          // .then(async ({ fileName, searchRequest }) => {
          //   const fullPathToFile = path.join(dirPath, fileName);
          //   const src = await fsp.stat(fullPathToFile);
          //   if (!src.isFile()) {
          //     return getFiles(fullPathToFile);
          //   }

          //   const readStream = fs.createReadStream(
          //     path.join(fullPathToFile),
          //     "utf-8",
          //   );

          //   const rl = readline.createInterface({
          //     input: readStream,
          //     output: process.stdout,
          //     crlfDelay: Infinity,
          //     terminal: false,
          //   });

          //   rl.on("line", (line) => {
          //     if (line.includes(searchRequest)) {
          //       console.log(line);
          //     }
          //   });
          // });
        }
      } else {
        res.end("Path doesn't exist");
      }
    });

    // const filePath = path.join(currentDirectory, "./index.html");
    // const rs = fs.createReadStream(filePath);

    // rs.pipe(res);
  }
});

const io = new Server(server);
io.on("connection", (client) => {
  console.log(`New client connected`);

  client.on("search-text", (data) => {
    client.broadcast.emit("server-msg", {
      msg: data.msg,
    });
  });

  client.client.on("open-file", (data) => {
    console.log();
    // client.emit("file-open", {
    //   msg: data.
    // });
  });
});

server.listen(port, host, () => {
  parentPort.postMessage({ result: `Server was started on ${host}:${port}` });
});
