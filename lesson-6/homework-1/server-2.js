import http from "http";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";
import { addClient, getClient, getClients, deleteClient } from "./clients.js";

const host = "localhost";
const port = 3000;
const currentDirectory = process.cwd();

const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {
    const filePath = path.join(currentDirectory, "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`New connection`);

  socket.on("login", ({ room }) => {
    const name = `User_${socket.id.slice(0, 5)}`;
    const { client } = addClient(socket.id, name, room);
    socket.join(client.room);
    socket.in(room).emit("notification", {
      msg: `${client.name} connected.`,
    });
    io.in(room).emit("clients", getClients(room));
  });

  socket.on("client-msg", (msg) => {
    const client = getClient(socket.id);
    io.in(client.room).emit("send message", {
      client: client.name,
      data: msg,
    });
  });

  socket.on("disconnect", () => {
    console.log("User left");

    const client = deleteClient(socket.id);
    if (client) {
      io.in(client.room).emit("notification", {
        msg: `${client.name} left.`,
      });
      io.in(client.room).emit("clients", getClients(client.room));
    }
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
