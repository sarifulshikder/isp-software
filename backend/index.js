const express = require('express');
const pool = require('./db');
const connectMikrotik = require('./mikrotik');
const app = express();

app.use(express.json());

// কাস্টমার এবং মাইক্রোটিক ইউজার তৈরি
app.post('/add-customer', async (req, res) => {
    const { name, username, password, profile } = req.body;

    try {
        // ১. মাইক্রোটিকে ইউজার তৈরি (PPPoE Secret)
        const mt = await connectMikrotik();
        if (mt) {
            mt.write('/ppp/secret/add', [
                '=name=' + username,
                '=password=' + password,
                '=profile=' + (profile || 'default'),
                '=service=pppoe'
            ]);
            console.log("✅ MikroTik Secret Created");
        }

        // ২. ডাটাবেসে সেভ করা
        const result = await pool.query(
            'INSERT INTO customers (name, username, password) VALUES ($1, $2, $3) RETURNING *',
            [name, username, password]
        );

        res.json({ message: "Customer added to DB & MikroTik", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('ISP Billing API: MikroTik Module Active!'));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Server running on port 5000'));
