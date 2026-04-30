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
            // চ্যানেল ওপেন করে কমান্ড পাঠানো
            const channel = client.openChannel();
            channel.write('/ppp/secret/add', {
                'name': username,
                'password': password,
                'profile': (profile || 'default'),
                'service': 'pppoe'
            });

            channel.on('done', () => {
                console.log("✅ Secret added to MikroTik successfully!");
                channel.close();
            });

            channel.on('trap', (err) => {
                console.error("❌ MikroTik Trap Error:", err);
                channel.close();
            });
        }

        const result = await pool.query(
            'INSERT INTO customers (name, username, password) VALUES ($1, $2, $3) RETURNING *',
            [name, username, password]
        );

        res.json({ message: "Process started", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('ISP Billing API: Stable MikroTik Sync Active'));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Server running on port 5000'));
