import { workerData, parentPort } from "worker_threads";

import { createConnection } from "mariadb";
import { computeStats, reducePropertyRecordsToPeople } from "./process";
import { loadBatchOfPropertyRecords, writeComparisonBatch } from "./database";
const [ids, credentials]:[number[],{}] = workerData;
const startDate: Date = new Date();
console.log(ids[0], "/", ids[1], "..", ids[ids.length - 1] + " resolving");

createConnection(credentials).then((connection) =>
  loadBatchOfPropertyRecords(connection, ids)
    .then(reducePropertyRecordsToPeople)
    .then(computeStats)
    .then((comparisons) => writeComparisonBatch(connection, comparisons))
    .then(() => {
      parentPort?.postMessage({
        done: true,
        value: {
          ids: ids,
        },
        time: (new Date().getTime() - startDate.getTime()) / 1000,
      });
      connection.end();
    })
    .catch(() => {
      throw { done: false, value: { ids: ids } };
    })
);
