import { getbatches } from "./createbatches";
import fs from "node:fs";
import { promiseWorker } from "./mainWorker";
import { ComparisonWorkers } from "./types";
const path = "ids.json";
const workerpath = "./worker.js";
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
function createworker() {
  let idfile = fs.readFileSync(path, "utf-8");
  const id:number[][] = JSON.parse(idfile);
  const workers:any[] = [];
  for (let i = 1; i < id.length - 1; i++) {
      const id:number[][] = JSON.parse(idfile);
      const ids = id[i];
      workers.push(
      promiseWorker<ComparisonWorkers>(ids, credentials, workerpath)
    );
  }
  Promise.allSettled(workers).then((workerResults) => {
    workerResults.forEach((e) => {
      if (e.status === "rejected") {
        console.error(e.reason.value.value.ids[0], "/", e.reason.value.value.ids[1], "failed");
      } else {
        console.log(e.value.value.ids[0], "/", e.value.value.ids[1], "done in", e.value.time, "seconds");
      }
    });
  });
}

//get (8, 125 ids) batches and then create workers
getbatches(credentials, 12, 1024).then(() => createworker());

/* original
createConnection(credentials).then((connection) =>
  getHighestAvailableIds(connection)
    .then((limits) => findBatchIds(connection, limits, 10))
    .then((ids) => {
      console.log(ids[0], "/", ids[1], "..", ids[ids.length - 1]);
      return ids;
    })
    .then((ids) => loadBatchOfPropertyRecords(connection, ids))
    .then(reducePropertyRecordsToPeople)
    .then(computeStats)
    .then((comparisons) => writeComparisonBatch(connection, comparisons))
    .then(() => connection.end()).catch((message) => console.error(message)),
);
*/
/* future implementation

async function createworker() {
  const jsonData = await importJsonFile("./ids.json");
  jsonData.allids.forEach((e) => {
    if (e.done === true) return;
    const ids: number[] = e.ids.map((id) => {
      return parseInt(id);
    });
    run(ids, credentials, workerpath);
  });
}
  */
