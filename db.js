// db.js
// require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // e.g., postgres
  host: 'localhost',
  database: 'react-vite-db',      // your database name
  password: '123',
  port: 5432,            // default PostgreSQL port
});

// Test the connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = pool;