const express = require('express');
const cors = require('cors');
const pool = require('./db');
const connectMikrotik = require('./mikrotik');

const app = express();
app.use(cors());
app.use(express.json());

// ১. কাস্টমার লিস্ট পাওয়ার API
app.get('/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ২. কাস্টমার অ্যাড করার API
app.post('/add-customer', async (req, res) => {
    const { name, username, password, profile } = req.body;
    try {
        await pool.query('INSERT INTO customers (name, username, password, profile) VALUES ($1, $2, $3, $4)', [name, username, password, profile]);
        const api = await connectMikrotik();
        if (api) {
            await api.write(['/ppp/secret/add', '=name=' + String(username), '=password=' + String(password), '=profile=' + String(profile || 'default'), '=service=pppoe', '=comment=' + String(name || '')]);
            api.close();
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(500).json({ error: 'MikroTik Connection Failed' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('🚀 Server is running on port 5000'));
