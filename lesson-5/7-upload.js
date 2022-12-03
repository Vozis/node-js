import http from "http";
import fsp from "fs/promises";
import path from "path";
import formidable from "formidable";

const port = 3001;
const host = "localhost";

const server = http.createServer((request, response) => {
  if (request.method === "POST") {
    const mfd = request.headers["content-type"].split(";")[0];
    if (mfd === "multipart/form-data") {
      const form = formidable({ multiples: true });
      form.parse(request, async (err, fields, files) => {
        for (const fileName in files) {
          const blob = files[fileName];
          const oldPath = blob.filepath;
          const destPath = ".";
          const rawData = await fsp.readFile(oldPath, "utf-8");
          console.log(rawData);
          console.log(blob);
          await fsp.writeFile(
            path.join(process.cwd(), destPath, "1-readfile.js"),
            rawData,
          );
        }

        const fileName = files.originalFilename;
        console.log(files);
      });
    }
  }

  response.end("");
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
