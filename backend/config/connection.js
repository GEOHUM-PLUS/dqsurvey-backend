// postgresql version
require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = {
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
  user: isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
  password: isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
  database: isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV,
  port: isProduction ? process.env.DB_PORT_PROD : process.env.DB_PORT_DEV,
  max: 10,                 // connectionLimit equivalent
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000
};

const pool = new Pool({
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
  user: isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
  password: isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
  database: isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV,
  port: isProduction ? process.env.DB_PORT_PROD : process.env.DB_PORT_DEV,

  // Change this part:
  ssl: isProduction ? { rejectUnauthorized: false } : false,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000
});


pool.connect()
  .then(client => {
    console.log(`✅ Connected to ${isProduction ? 'Production' : 'Local'} DB: ${isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });
module.exports = pool;
