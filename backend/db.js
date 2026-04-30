const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'isp_db',
  database: 'isp_manager',
  password: 'password',
  port: 5432,
});

module.exports = pool;
