import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

let db : ReturnType<typeof drizzle>;

const startDb = async () => {
    const pool = new Pool({
        connectionString: process.env.DB_URL,
    });
    try {
        await pool.query('select 1')
        console.log("Connection Established!");

        db = drizzle({client : pool})

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

export {startDb, db}
