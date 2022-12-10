import http from "http";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";
import { Handler } from "./handler.js";
import { emitter as MyEmitter } from "./mfc.js";

const host = "localhost";
const port = 3001;
const currentDirectory = process.cwd();

// const list = [];

const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {
    const filePath = path.join(currentDirectory, "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);
io.on("connection", (client) => {
  console.log(`Websocket connected`);

  MyEmitter.on("send", (payload) => {
    client.emit("server-msg", Handler.send(payload));
  });
  MyEmitter.on("recieve", (payload) => {
    client.emit("server-msg", Handler.recieve(payload));
  });
  MyEmitter.on("sign", (payload) => {
    client.emit("server-msg", Handler.sign(payload));
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
