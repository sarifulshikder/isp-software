const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

// ১. ডেটাবেস টেবিল তৈরি (Customer Table)
const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      mobile VARCHAR(15),
      address TEXT,
      package_name VARCHAR(50),
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("✅ Customer table is ready");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
};

createTables();

// ২. API Routes
app.get('/', (req, res) => {
  res.send('ISP Billing Software API is live with Database!');
});

// গ্রাহক যোগ করার একটি সিম্পল টেস্ট রুট
app.post('/add-customer', async (req, res) => {
  const { name, username, password, mobile } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO customers (name, username, password, mobile) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, username, password, mobile]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
