import http from "http";
import path from "path";
import fs from "fs";

const host = "localhost";
const port = 3001;

const server = http.createServer((request, response) => {
  const filePath = path.join(process.cwd(), "/access_tmp.log");

  const readStream = fs.createReadStream(filePath, {
    encoding: "utf-8",
    highWaterMark: 64,
  });

  readStream.on("data", (chunk) => {
    console.log(chunk);
    response.write(chunk);
  });

  readStream.on("end", () => {
    response.end();
  });

  // readStream.pipe(response);

  // response.end();
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
