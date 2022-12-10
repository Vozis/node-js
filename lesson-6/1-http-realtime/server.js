import http from "http";
import path from "path";
import fs from "fs";
import { Handler } from "./handler.js";
import { emitter as MyEmitter } from "./mfc.js";

const host = "localhost";
const port = 3001;
const currentDirectory = process.cwd();

const list = [];

MyEmitter.on("send", (payload) => list.push(Handler.send(payload)));
MyEmitter.on("recieve", (payload) => list.push(Handler.recieve(payload)));
MyEmitter.on("sign", (payload) => list.push(Handler.sign(payload)));

const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {
    if (req.url === "/api") {
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(list));
    }
    const filePath = path.join(currentDirectory, "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
