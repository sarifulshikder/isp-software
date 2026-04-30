const { Pool } = require('pg');

const pool = new Pool({
  user: 'isp_user',
  host: 'db',
  database: 'isp_management',
  password: 'your_secure_password',
  port: 5432,
});

pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database');
});

module.exports = pool;
