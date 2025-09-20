import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config(); 

export default defineConfig({
    schema: './db/schema',      
    out: './drizzle',                  
    dialect : "postgresql",
    dbCredentials : {
        url : process.env.DB_URL!
    }
});
