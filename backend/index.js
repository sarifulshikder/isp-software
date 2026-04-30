const express = require('express');
const pool = require('./db');
const connectMikrotik = require('./mikrotik');
const app = express();

app.use(express.json());

app.post('/add-customer', async (req, res) => {
    const { name, username, password, profile } = req.body;

    try {
        const client = await connectMikrotik();
        
        if (client) {
            // মাইক্রোডি লাইব্রেরিতে কমান্ড পাঠানোর সঠিক পদ্ধতি
            client.write('/ppp/secret/add', {
                'name': username,
                'password': password,
                'profile': (profile || 'default'),
                'service': 'pppoe'
            });
            console.log("🚀 Command sent to MikroTik");
        }

        const result = await pool.query(
            'INSERT INTO customers (name, username, password) VALUES ($1, $2, $3) RETURNING *',
            [name, username, password]
        );

        res.json({ message: "Request processed", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('ISP Billing API: Stable Version'));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Server running on port 5000'));
