import fs from "fs";
// const rl = require("readline");
import { Transform } from "stream";

const ACCESS_LOG = "./access_tmp.log";

// const data = fs.readFile(
//   ACCESS_LOG,
//   {
//     encoding: "utf8",
//   },
//   (err, data) => {
//     if (err) console.log(err);
//     else {
//       console.log(typeof data);
//       const logArray = Array.from(data.split("\n"));
//       const logsWith89 = logArray.filter((item) =>
//         item.includes("89.123.1.41"),
//       );
//       console.log(newArray);
//     }
//   },
// );

const requests = ["34.48.240.111", "89.123.1.41"];

const createIpFiles = () => {
  const readStream = fs.createReadStream(ACCESS_LOG, {
    encoding: "utf8",
  });

  requests.forEach((ip) => {
    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        const logsArray = Array.from(chunk.toString().split("\n")).filter(
          (item) => item.includes(ip),
        );

        console.log("chunk");
        console.log(logsArray);

        const data = logsArray.join("\n");

        this.push(data);
        callback();
      },
    });

    const fileName = `${ip}_request.log`;
    const writeStream = fs.createWriteStream(fileName);

    readStream
      .pipe(transformStream)
      .pipe(writeStream)
      .on("end", () => {
        console.log("files were created");
      });
  });
};

createIpFiles();

// readStream.on("data", (chunk) => {
//   console.log(typeof chunk);
// });
