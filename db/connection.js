const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}`});

const config = {};

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

/* const pool = new Pool({
    user: process.env.CHRISUSER,
    password: process.env.CHRISPASSWORD,
    host: process.env.CHRISHOST,
    port: process.env.CHRISPORT,
    database: process.env.CHRISDATABASE,
}); */ 

const pool = new Pool(config);

module.exports = pool;