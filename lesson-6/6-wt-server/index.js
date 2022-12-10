import { Worker } from "worker_threads";
import os from "os";

const numCPUs = os.cpus().length / 2;
// console.log(`Master wor`);

let i = 0;
while (i < numCPUs) {
  const workerData = { portOfset: 1 };
  const worker = new Worker("./worker.js", {
    workerData,
  });
  worker.on("message", console.log);

  i++;
}
