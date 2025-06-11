// ------------------------------------------------------------------------------
// OLD CONNECTION LOCAL
// ------------------------------------------------------------------------------

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres', // e.g., postgres
//   host: 'localhost',
//   database: 'react-vite-db',      // your database name
//   password: '123',
//   port: 5432,            // default PostgreSQL port
// });

// // Test the connection
// pool.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('Connection error', err.stack));

// module.exports = pool;

// ------------------------------------------------------------------------------
// NEW CONNECTION AWS RDS
// ------------------------------------------------------------------------------

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  }
});

pool.connect()
  .then(() => console.log('Connected to AWS RDS PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = pool;
