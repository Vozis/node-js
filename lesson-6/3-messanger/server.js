import http from "http";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";

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

  client.on("client-msg", (data) => {
    client.emit("server-msg", {
      msg: data.msg,
    });
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
