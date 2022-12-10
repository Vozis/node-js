import http from "http";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";

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

// const socketList = [];

io.on("connection", (socket) => {
  console.log(`New connection`);
  socket.data.userName = `User_${socket.id.slice(0, 5)}`;
  socketList.push(socket);
  socket.join("online");

  socket.broadcast.emit("new-client", {
    msg: `User_${socket.data.userName} connected.`,
  });

  socket.on("disconnecting", (socket) => {
    socketList.pop(socket);
    console.log(socket);
    console.log("User left");

    // io.emit("client-left", {
    //   msg: `User_${socket.data.userName} left.`,
    // });
  });

  socket.on("client-msg", ({ msg, client }) => {
    // let name = "";

    // if (client === socket.id) {
    //   name = "Me";
    // } else {
    //   name = socket.data.userName;
    // }
    const name = socket.data.userName;

    io.emit("server-msg", {
      name: name,
      msg: msg,
    });
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

// const clients = io.sockets.adapter.rooms.get("online");

// io.of("/").adapter.on("join-room", (room, id) => {
//   console.clear();
//   console.log(`socket ${id} has joined room ${room}`);
// });

// socket.join("online");
// for (let [id] of io.of("/").sockets) {
//   // const client = {
//   //   socketId: id,
//   // };
//   socketList.push(id);
// }

// console.log(socketList);

// socket.on("disconnecting", (reason) => {
//   for (const room of socket.rooms) {
//     if (room !== socket.id) {
//       socket.to(room).emit("client-left", socket.id);
//     }
//   }
// });
