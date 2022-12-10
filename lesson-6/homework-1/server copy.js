import http from "http";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";

const host = "localhost";
const port = 3001;
const currentDirectory = process.cwd();

const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {
    const filePath = path.join(currentDirectory, "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);

// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;

//   if (sessionID) {
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }

//   socket.sessionID = randomId();
//   socket.useID = randomId();
//   socket.username = randomId();
//   next();
// });

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   next();
// });

io.on("connection", (socket) => {
  console.log(`New connection`);
  const clientList = [];
  let count = 1;
  for (let [id, socket] of io.of("/").sockets) {
    const client = {
      userId: id,
      userName: `User ${count}`,
    };
    clientList.push(client);
    count++;
  }

  console.log("clientList", clientList);

  socket.broadcast.emit("new-client", clientList);

  // socket.auth = socket.id;

  // console.log("socket autth", socket.auth);
  // socket.emit("session", {
  //   sessionID: socket.sessionID,
  //   userID: socket.userID,
  // });

  // console.clear();

  // socket.join("online");
  // console.log(socket.rooms);
  // console.log(socket.id);
  // console.log(socket.rooms);
  // console.log(socket.handshake);

  // setTimeout(() => {
  //   clientList.push({
  //     id: client.id,
  //   });
  //   console.log(clientList);
  // }, 0);

  socket.on("client-msg", (data) => {
    socket.emit("server-msg", {
      msg: data.msg,
    });
  });

  socket.on("disconnect", (socket) => {
    const leaver = clientList.filter((item) => item.id === socket.id);
    console.log(leaver);
    console.log("Client disconnected");
  });
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
