import { createConnection, Connection } from "mariadb";
import fsPromises from "node:fs/promises";
import { findBatchIds, getHighestAvailableIds } from "./database";

export async function getbatches(
  credentials: {},
  batches: number,
  BATCH_SIZE: number = 10,
  table: string = "student_similarity_graph"
) {
  const connection = await createConnection(credentials);
  try {
    const limits = await getHighestAvailableIds(connection, table);
    const ids = await findBatchIds(connection, limits, BATCH_SIZE);
    console.log(ids[0], "/", ids[1], "..", ids[ids.length - 1]);
    await updateIdsFile(ids);
    await loopinggetnextavaialbleIds(connection, batches, BATCH_SIZE);
    return "success";
  } finally {
    connection.end();
  }
}

async function loopinggetnextavaialbleIds(
  connection: Connection,
  batches: number,
  BATCH_SIZE: number
) {
  for (let i = 0; i < batches - 1; i++) {
    const limits = await getnextavailableIds();
    const ids = await findBatchIds(connection, limits, BATCH_SIZE);
    console.log(ids[0], "/", ids[1], "..", ids[ids.length - 1]);
    await updateIdsFile(ids);
  }
}

async function updateIdsFile(ids: number[]) {
  const file = await fsPromises.readFile("ids.json", "utf-8");
  const idArray: number[][] = JSON.parse(file);
  idArray.push(ids);
  await fsPromises.writeFile("ids.json", JSON.stringify(idArray), {
    flag: "w",
  });
}

type GetNextAvailableIds = () => Promise<[number, number, number]>;
const getnextavailableIds: GetNextAvailableIds = async () => {
  const file = await fsPromises.readFile("ids.json", "utf-8");
  const idArray: number[][] = JSON.parse(file);
  const lastIDs = idArray[idArray.length - 1];
  const returntype: [[number], [number, number]] = [
    [idArray[0][0]],
    [lastIDs[0], lastIDs.slice(-1)[0]],
  ];
  const [end, low, high] = [
    returntype[0][0] || 0,
    returntype[1][0] || 0,
    returntype[1][1] || 0,
  ];
  return [low, high, end];
};

