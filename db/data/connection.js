const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
    user: process.env.CHRISUSER,
    password: process.env.CHRISPASSWORD,
    host: process.env.CHRISHOST,
    port: process.env.CHRISPORT,
    database: process.env.CHRISDATABASE,
});

module.exports = pool;