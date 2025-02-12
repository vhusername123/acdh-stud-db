import { Connection, UpsertResult } from "mariadb";
import { Comparison, PropRecord } from "./types";
import fs from "node:fs";

type FindBatchIds = (
  connection: Connection,
  highestAvailableIds: [number, number, number],
  maxSize: number
) => Promise<number[]>;
export const findBatchIds: FindBatchIds = (
  connection,
  highestAvailableIds,
  maxSize
) => {
  const [left, right, max] = highestAvailableIds;
  if (!fs.existsSync("ids.json")) {
    fs.writeFileSync("ids.json", '{ "max": ' + max + ", }" + "\n");
  }
  return connection
    .query(
      {
        rowsAsArray: true,
        bigIntAsNumber: true,
        // language=MariaDB
        sql:
          "(select person_id from student_identity where person_id >= ? limit 1)" +
          " union " +
          "(select person_id from student_identity where person_id > ? limit ?)",
      },
      [
        left + (right === max ? 1 : 0),
        right === max ? left + 1 : right,
        maxSize,
      ]
    )
    .then((result) => result.flat())
    .then((result) => {
      if (result.length < 2)
        throw new Error(
          "No more records after " + highestAvailableIds.join(":")
        );
      else return result;
    });
};

type GetHighestAvailableIds = (
  connection: Connection
) => Promise<[number, number, number]>;
export const getHighestAvailableIds: GetHighestAvailableIds = (connection) =>
  connection
    .query({
      rowsAsArray: true,
      bigIntAsNumber: true,
      // language=MariaDB
      sql:
        "(select max(person_id), 0 from student_identity)" +
        " union " +
        "(select id_low, id_high from student_similarity_graph order by id_low desc, id_high desc limit 1)" +
        " union " +
        "(select 0, 0 from dual)",
    })
    // [["35678",  0],
    // [    2, 13],
    // [    0,  0]]
    .then(
      ([[end], [low, high]]) =>
        [low || 0, high || 0, end || 0].map((n) => +n) as [
          number,
          number,
          number,
        ]
    );

type LoadBatchOfPropertyRecords = (
  connection: Connection,
  ids: number[]
) => Promise<PropRecord[]>;
export const loadBatchOfPropertyRecords: LoadBatchOfPropertyRecords = (
  connection,
  ids
) =>
  connection.query(
    // language=MariaDB
    "(" +
      "select person_id, property, id, value, value2, value3, is_doubtful, times, year_min, year_max " +
      "from v_student_complete " +
      "where (person_id = ? or person_id between ? and ?) " +
      "and property in ('birth_place', 'father', 'given_names', 'graduation'," +
      " 'guardian', 'last_name', 'last_school', 'studying_address')" +
      ") union (" +
      "select person_id, 'birth_date' property, id, birth_date value, born_on_or_after value2, born_on_or_before value3, is_doubtful, null times, null year_min, null year_max " +
      "from v_most_precise_birth_date " +
      "where (person_id = ? or person_id between ? and ?) " +
      ") order by person_id, property, year_min, year_max",
    [ids[0], ids[1], ids[ids.length - 1], ids[0], ids[1], ids[ids.length - 1]]
  );

type WriteComparisonBatch = (
  connection: Connection,
  data: Comparison[]
) => Promise<UpsertResult> | undefined;
export const writeComparisonBatch: WriteComparisonBatch = (
  connection,
  data
) => {
  const paramMap = data.flatMap((c) =>
    Object.entries(c.stats).map(([k, v]) => [
      c.idLow,
      c.idHigh,
      k,
      ...v.map((n) => n.toFixed(5)),
    ])
  );
  if (paramMap.length > 0) {
    return connection.batch(
      {
        // language=MariaDB
        sql:
          "insert into student_similarity_graph (id_low, id_high, property, mean, median, min, max, count) " +
          "values (?, ?, ?, ?, ?, ?, ?, ?)",
      },
      paramMap
    );
  }
};
