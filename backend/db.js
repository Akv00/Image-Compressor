import pg from "pg";
import fs from "fs";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
        // ca: fs.readFileSync('./ca.pem').toString(),
    },
})

export default pool
