import fs from "fs";
import http, { request } from "http";
import { hostname } from "os";
import path from "path";

const startedPort = 3001;
const host = "localhost";

const shift = parseInt(process.argv[2]);
const port = startedPort + shift;

http
  .createServer((request, response) => {
    console.log(`Master ${process.pid} is running...`);

    const filePath = path.join(process.cwd(), "/access_tmp.log");
    const readStream = fs.createReadStream(filePath, {
      encoding: "utf-8",
      highWaterMark: 64,
    });

    response.writeHead(200, { "Content-Type": "text/html" });
    readStream.on("data", (chunk) => {
      console.log(chunk);
      response.write(chunk);
    });

    readStream.on("end", () => {
      response.end();
    });

    // readStream.pipe(response);

    // response.end();
  })
  .listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
