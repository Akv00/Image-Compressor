import pool from "../db.js";
import { CSV_DATA_TABLE } from "../config/index.js";
import { z } from "zod";
import { DOMAIN } from "./processCsv.js";

const uuidSchema = z.string().uuid();

const status = async (req, res) => {
  try {
    const id = uuidSchema.parse(req.params.id);
    const client = await pool.connect();
    const { rows } = await client.query(
      `select csv_path, status, processing_percentage from ${CSV_DATA_TABLE} where id = $1`,
      [id]
    );
    client.release();
    if (rows.length !== 1) {
      throw new Error("Something went wrong!!");
    }
    const { csv_path: inputFileId, status, processing_percentage } = rows[0];
    if (status === "completed") {
      return res.status(200).json({
        inputCsv: `${DOMAIN}/file/data/input-csv/${inputFileId}.csv`,
        outputCsv: `${DOMAIN}/file/data/output-csv/${inputFileId}.csv`,
        status,
      });
    }
    return res.status(200).json({
      inputCsv: `${DOMAIN}/file/data/input-csv/${inputFileId}.csv`,
      processing_percentage,
      status,
    });
  } catch (err) {
    return next(err);
  }
};

export default status;
