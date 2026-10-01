// configures the connection between Node and PostgreSQL
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();


// to manage database connections for the application
const { Pool } = pg;

// pool created that will be used during database communication using postgre configuration
export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), 
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
})

// checks for the database the server is connected to 
pool.query("SELECT current_database()")
    .then((result) => {
        // status confirms connection established 
        console.log("Connected to PostgreSQL database", result.rows[0].current_database);
    })
    .catch((error) => {
        // status confirms connection is not connected
        console.error("Database connection failed: ", error);
    });
