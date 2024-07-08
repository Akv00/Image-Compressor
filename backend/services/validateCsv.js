import Papa from "papaparse";
import fs from "fs";
import { z } from "zod";

const csvSchema = z
  .object({
    "Serial Number": z.string(),
    "Product Name": z.string(),
    "Input Image Urls": z.string(),
  })
  .strict();
const urlSchema = z.array(z.string().url());

const validateCsv = (fileContent) => {
    const { data: papaData, errors } = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });
      if (errors && errors.length > 0) throw errors;
      let formattedData = [];
      let totalImages = 0;
    papaData.forEach((d) => {
        try {
          const zodData = csvSchema.parse(d);
          const sn = parseInt(zodData["Serial Number"]);
          if (Number.isNaN(sn)) throw new Error("Invalid serial number");
          const imageUrls = urlSchema.parse(
            zodData["Input Image Urls"].split(",")
          );
          formattedData.push({
            sn,
            productName: zodData["Product Name"],
            inputImageUrls: imageUrls,
          });
          totalImages += imageUrls.length;
        } catch (zodErr) {
          throw zodErr;
        }
      });
      return { formattedData, totalImages };
}

export default validateCsv

