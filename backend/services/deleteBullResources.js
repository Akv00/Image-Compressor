import { readFile, writeFile } from "fs/promises";
import Papa from "papaparse";
import pool from "../db.js";
import { CSV_DATA_TABLE } from "../config/index.js";

export const deleteBullResources = async (queue, worker, events) => {
  const id = queue.name.split("queue-")[1];
  const jobsLeft = await queue.getJobCountByTypes(
    "waiting",
    "active",
    "delayed"
  );
  const jobsCompleted = await queue.getJobCountByTypes("completed", "failed");
  if (jobsLeft + jobsCompleted === 0) {
    throw new Error("Something went wrong!!");
  }
  const percentage = Math.min(
    100,
    Math.ceil((jobsCompleted / (jobsLeft + jobsCompleted)) * 100)
  );
  let client = await pool.connect();
  client.query(
    `update ${CSV_DATA_TABLE} set processing_percentage = $1 where id = $2`,
    [percentage, id]
  );
  client.release();
  if (jobsLeft !== 0) {
    console.log("Queue is still running");
    return;
  }
  //   await queue.obliterate();
  await queue.close();
  await worker.close();
  await events.close();
  client = await pool.connect();
  const { rows } = await client.query(
    `select csv_path from ${CSV_DATA_TABLE} where id = $1`,
    [id]
  );
  if (rows.length !== 1) {
    throw new Error("Something went wrong");
  }
  const outputFileId = rows[0].csv_path;
  const jsonData = JSON.parse(
    await readFile(`./data/json/${outputFileId}.json`)
  );
  jsonData?.sort((a, b) => a.sn - b.sn);
  const csvString = Papa.unparse(jsonData);
  await writeFile(`./data/output-csv/${outputFileId}.csv`, csvString);
  await client.query(
    `update ${CSV_DATA_TABLE} set status = 'completed' where id = $1`,
    [id]
  );
  client.release();
  console.log("Graceful Degradation!!");
  
};
