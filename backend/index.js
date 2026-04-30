const express = require('express');
const pool = require('./db');
const connectMikrotik = require('./mikrotik');
const app = express();

app.use(express.json());

app.post('/add-customer', async (req, res) => {
    const { name, username, password, profile } = req.body;

    try {
        const api = await connectMikrotik();
        
        if (api) {
            // routeros-client এ কমান্ড পাঠানোর নিয়ম
            await api.write('/ppp/secret/add', {
                'name': username,
                'password': password,
                'profile': (profile || 'default'),
                'service': 'pppoe'
            });
            console.log("🚀 Secret Created in MikroTik");
            api.close();
        }

        const result = await pool.query(
            'INSERT INTO customers (name, username, password) VALUES ($1, $2, $3) RETURNING *',
            [name, username, password]
        );

        res.json({ message: "Customer added successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('ISP Billing API: Stable MikroTik Sync Active'));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Server running on port 5000'));
