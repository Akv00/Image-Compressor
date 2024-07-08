import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/input-csv");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

import processCsv from "./controllers/processCsv.js";
import status from "./controllers/status.js";

const router = Router();
router.post("/uploadfile", upload.single("file"), processCsv);
router.get("/status/:id", status);
export default router;
