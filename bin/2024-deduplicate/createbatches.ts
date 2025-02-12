import { createConnection, Connection } from "mariadb";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { findBatchIds, getHighestAvailableIds } from "./database";

export function getbatches(
  credentials: {},
  batches: number,
  BATCH_SIZE: number = 10
) {
  return new Promise<string>((resolve) =>
    createConnection(credentials).then((connection) =>
      getHighestAvailableIds(connection)
        .then((limits: [number, number, number]) =>
          findBatchIds(connection, limits, BATCH_SIZE)
        )
        .then((ids: string | any[]) => {
          console.log(ids[0], "/", ids[1], "..", ids[ids.length - 1]);
          fs.writeFileSync("ids.json", JSON.stringify(ids) + "\n", {
            flag: "a+",
          });
          return ids;
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
        fs.writeFileSync("ids.json", JSON.stringify(ids) + "\n", {
          flag: "a+",
        });
        return ids;
      });
  }
}

type GetNextAvailableIds = () => Promise<[number, number, number]>;
const getnextavailableIds: GetNextAvailableIds = () =>
  fsPromises
    .readFile("ids.json", "ascii")
    .then((file) => {
      const filebyLines = file.split("\n");
      const lastline = filebyLines[filebyLines.length - 2];
      let length = lastline.length;
      let line = lastline.substring(1, length - 1).split(",");
      return [[filebyLines[0]], [line[0], line[line.length - 1]]];
    })
    .then(
      ([[end], [low, high]]) =>
        [low || 0, high || 0, end || 0].map((n) => +n) as [
          number,
          number,
          number,
        ]
    );
