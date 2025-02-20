import { createConnection, Connection } from "mariadb";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { findBatchIds, getHighestAvailableIds } from "./database";

export function getbatches(
  credentials: {},
  batches: number,
  BATCH_SIZE: number = 10,
  table: string = "student_similarity_graph"
) {
  return new Promise<string>((resolve) =>
    createConnection(credentials).then((connection) =>
      getHighestAvailableIds(connection, table)
        .then((limits: [number, number, number]) =>
          findBatchIds(connection, limits, BATCH_SIZE)
        )
        .then((ids) => {
          fsPromises.readFile("ids.json", "utf-8").then((file: string) => {
            const idArray:number[][] = JSON.parse(file)
            idArray.push(ids)
            fs.writeFileSync("ids.json", JSON.stringify(idArray), {
              flag: "w",
            });
          })
        })
        .then(() => loopinggetnextavaialbleIds(connection, batches, BATCH_SIZE))
        .then(() => {
          connection.end();
          resolve("success");
        })
    )
  );
}

async function loopinggetnextavaialbleIds(
  connection: Connection,
  batches: number,
  BATCH_SIZE: number
) {
  for (let i = 0; i < batches - 1; i++) {
    await getnextavailableIds()
      .then((limits) => findBatchIds(connection, limits, BATCH_SIZE))
      .then((ids) => {
        console.log(ids[0], "/", ids[1], "..", ids[ids.length - 1]);
        fsPromises.readFile("ids.json", "utf-8").then((file: string) => {
          const idArray:number[][] = JSON.parse(file)
          idArray.push(ids)
          fs.writeFileSync("ids.json", JSON.stringify(idArray), {
            flag: "w",
          });
        })
        return ids;
      });
  }
}

type GetNextAvailableIds = () => Promise<[number, number, number]>;
const getnextavailableIds: GetNextAvailableIds = () =>
  fsPromises.readFile("ids.json", "utf-8")
      .then((file: string) => {
      const idArray:number[][] = JSON.parse(file)
      const lastIDs = idArray[idArray.length -1];
      const returntype: [[number], [number, number]] = [[idArray[0][0]], [lastIDs[0], lastIDs.slice(-1)[0]]]; 
      return returntype;
    })
    .then(
      ([[end], [low, high]]: [[number], [number, number]]) =>
        [low || 0, high || 0, end || 0].map((n) => +n) as [
          number,
          number,
          number,
        ]
    );
