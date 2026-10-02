const { Pool } = require('pg');

require('dotenv').config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log(
  "DB_PASSWORD loaded:",
  process.env.DB_PASSWORD ? "YES" : "NO"
);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) =>
  console.error('PostgreSQL pool error:', err)
);

module.exports = pool;