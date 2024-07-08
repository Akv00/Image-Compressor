import express from "express";
import cors from "cors";
import { FRONTEND_URL, PORT } from "./config/index.js";
import router from "./router.js";
import errorHandler from "./middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url"
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(
  cors({
    origins: ["http://localhost:5173", FRONTEND_URL],
  })
);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("<h1>Hello World!!</h1>");
});
app.get("/file/:f1/:f2/:filename", (req, res) => {
  const { f1, f2, filename } = req.params;
  const filePath = path.join(__dirname, f1, f2, filename);
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }
    return res.sendFile(filePath);
  } catch (err) {
    return next(err);
  }
});
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
