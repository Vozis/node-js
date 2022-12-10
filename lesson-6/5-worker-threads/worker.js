import { workerData, parentPort } from "worker_threads";
import crypto from "crypto";

const password = crypto.randomBytes(workerData).toString("hex");

parentPort.postMessage({ result: `Password was generated: ${password}.` });
