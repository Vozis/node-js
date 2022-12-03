import os from "os";
import cluster from "cluster";
import fs from "fs";
import http, { request } from "http";
import path from "path";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running...`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking proccess number ${i}...`);
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started...`);

  const host = "localhost";
  const port = 3001;

  const server = http.createServer((request, response) => {
    console.log(`Worker ${process.pid} handle this request...`);

    setTimeout(() => {
      let result = "";
      if (request.method === "GET") {
        const filePath = path.join(process.cwd(), "/access_tmp.log");

        const readStream = fs.createReadStream(filePath, {
          encoding: "utf-8",
          highWaterMark: 64,
        });

        response.writeHead(200, { "Content-Type": "text/html" });
        // readStream.on("data", (chunk) => {
        //   console.log(chunk);
        //   response.write(chunk);
        // });

        // readStream.on("end", () => {
        //   response.end();
        // });

        readStream.pipe(response);

        response.end();
      } else if (request.method === "POST") {
        let data = "";
        request.on("data", (chunk) => {
          data += chunk;
        });

        request.on("end", () => {
          response.writeHead(200, { "Content-Type": "json" });
          console.log(JSON.parse(data));
          response.end(data);
        });
      } else {
        response.statusCode = 405;
        result = "Method not allowed";
      }
    }, 5000);
  });

  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
}
