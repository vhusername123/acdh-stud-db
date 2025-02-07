import { createConnection } from "mariadb";
import { computeStats, reducePropertyRecordsToPeople } from "./process";
import { getbatches } from "./createbatches";
import fs from "node:fs"
import { run } from "./mainWorker";
import { getHighestAvailableIds, findBatchIds, loadBatchOfPropertyRecords, writeComparisonBatch } from "./database";
const path = "ids.json";
const workerpath = './worker.js'
const credentials = {
  host: "localhost",
  port: 13006,
  database: "rksd",
  charset: "utf8",
  user: "rksd",
  password: "nJkyj2pOsfUi",
};
if (fs.existsSync(path)){
  fs.rmSync(path, {force:true});
}
//function to read the json file to create as many workers as needed
function createworker(){
  let idfile = fs.readFileSync(path,"ascii").split("\n");
  for (let i = 1; i < idfile.length-1; i++) {
    const idsstring = idfile[i].substring(1,idfile[i].length -1)
    const ids:number[] = idsstring.split(",").map((id) => {
      return parseInt(id)
    })
    run(ids,credentials,workerpath)
  }
}

//get (8, 125 ids) batches and then create workers
getbatches(credentials,8,1024).then(() => createworker());


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