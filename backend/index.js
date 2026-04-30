const express = require('express');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const JWT_SECRET = 'your_super_secret_key_123'; // এটি পরে .env ফাইলে নিতে হবে

// টেবিল তৈরি (Customers & Admins)
const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      mobile VARCHAR(15),
      status VARCHAR(20) DEFAULT 'Active'
    );`
  ];
  for (let q of queries) {
    await pool.query(q);
  }
  console.log("✅ Tables are ready");
};
createTables();

// --- Auth Routes ---

// ১. অ্যাডমিন রেজিস্ট্রেশন (প্রথমবার ইউজার বানানোর জন্য)
app.post('/auth/register', async (req, res) => {
  const { name, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO admins (name, username, password) VALUES ($1, $2, $3) RETURNING id, username',
      [name, username, hashedPassword]
    );
    res.json({ message: "Admin created successfully", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Username already exists" });
  }
});

// ২. অ্যাডমিন লগইন (টোকেন জেনারেট করা)
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/', (req, res) => res.send('ISP Billing API: Security Module Active!'));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Server running on port 5000'));
