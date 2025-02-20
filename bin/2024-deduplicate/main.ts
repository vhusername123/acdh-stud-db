import { getbatches } from "./createbatches";
import fs from "node:fs";
import { promiseWorker } from "./mainWorker";
import { ComparisonWorkers } from "./types";
const path = "ids.json";
const credentials = {
  host: "localhost",
  port: 13006,
  database: "rksd",
  charset: "utf8",
  user: "rksd",
  password: "nJkyj2pOsfUi",
};
if (fs.existsSync(path)) {
  fs.rmSync(path, { force: true });
}
//function to read the json file to create as many workers as needed
function createworker(workerpath:string="./worker.js") {
  let idfile = fs.readFileSync(path, "utf-8");
  const id:number[][] = JSON.parse(idfile);
  const workers:any[] = [];
  for (let i = 1; i < id.length - 1; i++) {
      const ids = id[i];
      workers.push(
      promiseWorker<ComparisonWorkers>(ids, credentials, workerpath)
    );
  }
  Promise.allSettled(workers).then((workerResults) => {
    workerResults.forEach((e) => {
      if (e.status === "rejected") {
        console.error(e.reason, "failed");
      } else {
        console.log(e.value.value.ids[0], "/", e.value.value.ids[1], "done in", e.value.time, "seconds");
      }
    });
  });
}

//get (8, 125 ids) batches and then create workers
//getbatches(credentials, 12, 1024).then(() => createworker());

getbatches(credentials, 24, 4048,'student_similarity_birthrange').then(() => createworker("./workerDateRange.js"));
