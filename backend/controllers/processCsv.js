import fs from "fs";
import { writeFile, readFile } from "fs/promises";
import pool from "../db.js";
import { CSV_DATA_TABLE } from "../config/index.js";
import { Queue, Worker, QueueEvents } from "bullmq";
import redisConnection from "../redis.js";
import sharp from "sharp";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { deleteBullResources } from "../services/deleteBullResources.js";
import validateCsv from "../services/validateCsv.js";

const JOB_NAME = "processing-images";
export const DOMAIN = "http://localhost:5000";

const processCsv = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error("File not found");
    }
    if (file.mimetype !== "text/csv") {
      throw new Error("Unsupported file type");
    }
    const inputFileId = file.filename.substr(0, file.filename.length - 4);
    const filePath = `./data/input-csv/${inputFileId}.csv`;
    const fileContent = fs.readFileSync(filePath, "utf8");

    let { formattedData, totalImages } = validateCsv(fileContent);

    const client = await pool.connect();
    const { rows } = await client.query(
      `insert into ${CSV_DATA_TABLE} (csv_path,no_of_products,no_of_images,status) values ($1,$2,$3,'processing') returning id;`,
      [inputFileId, formattedData.length, totalImages]
    );
    if (rows.length !== 1) {
      client.release();
      throw new Error("Somewhere went wrong");
    }
    const jsonFilePath = `./data/json/${inputFileId}.json`;
    await writeFile(jsonFilePath, JSON.stringify([]));
    const id = rows[0].id;
    const queue = new Queue(`queue-${id}`, {
      connection: { ...redisConnection },
    });
    const worker = new Worker(
      `queue-${id}`,
      async (job) => {
        const { sn, productName, inputImageUrls, outputFileId } = job.data;
        let outputImageUrls = [];
        for (let i = 0; i < inputImageUrls.length; i++) {
          const imageUrl = inputImageUrls[i];
          const imageResponse = await axios({
            url: imageUrl,
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(imageResponse.data, "binary");
          const outputBuffer = await sharp(imageBuffer)
            .metadata()
            .then((metadata) => {
              return sharp(imageBuffer)
                .resize(
                  Math.round(metadata.width / 2),
                  Math.round(metadata.height / 2)
                )
                .jpeg({ quality: 50, force: false })
                .toBuffer();
            });
          // .jpeg({ quality: 50 })
          // .toBuffer();
          const outputImageId = uuidv4();
          const outputImageUrl = `${DOMAIN}/file/data/output-images/output-${outputImageId}.jpeg`;
          await writeFile(
            `./data/output-images/output-${outputImageId}.jpeg`,
            outputBuffer
          );
          outputImageUrls.push(outputImageUrl);
        }
        let jsonData = JSON.parse(
          await readFile(`./data/json/${outputFileId}.json`)
        );
        jsonData.push({
          "S.No.": sn,
          "Product Name": productName,
          "Input Image Urls": inputImageUrls,
          "Output Image Urls": outputImageUrls,
        });
        await writeFile(
          `./data/json/${outputFileId}.json`,
          JSON.stringify(jsonData)
        );
      },
      { connection: { ...redisConnection } }
    );
    const events = new QueueEvents(`queue-${id}`, {
      connection: { ...redisConnection },
    });
    formattedData.forEach(async (d) => {
      await queue.add(JOB_NAME, { ...d, outputFileId: inputFileId });
    });
    client.release();
    res.status(200).json({ id });
    events.on("completed", async ({ jobId }) => {
      console.log(`job ${jobId} completed`);
      await deleteBullResources(queue, worker, events);
    });
    events.on("failed", async ({ jobId, failedReason }) => {
      console.log(`job ${jobId} ${failedReason} failed`);
      await deleteBullResources(queue, worker, events);
    });
  } catch (err) {
    return next(err);
  }
};

export default processCsv;
