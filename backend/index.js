const express = require('express');
const pool = require('./db');
const connectMikrotik = require('./mikrotik');
const app = express();

app.use(express.json());

// কাস্টমার এবং মাইক্রোটিক ইউজার তৈরি (সংশোধিত)
app.post('/add-customer', async (req, res) => {
    const { name, username, password, profile } = req.body;

    try {
        const mt = await connectMikrotik();
        if (mt) {
            // মাইক্রোডি লাইব্রেরিতে চ্যানেল ওপেন করে কমান্ড পাঠাতে হয়
            const chan = mt.openChannel();
            chan.write('/ppp/secret/add', {
                'name': username,
                'password': password,
                'profile': (profile || 'default'),
                'service': 'pppoe'
            });
            
            chan.on('done', (p) => {
                console.log("✅ MikroTik Secret Created Successfully");
                chan.close();
            });

            chan.on('trap', (e) => {
                console.error("❌ MikroTik Error:", e);
                chan.close();
            });
        }

        // ২. ডাটাবেসে সেভ করা
        const result = await pool.query(
            'INSERT INTO customers (name, username, password) VALUES ($1, $2, $3) RETURNING *',
            [name, username, password]
        );

        res.json({ message: "Customer addition initiated", data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('ISP Billing API: MikroTik Module Fixed!'));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Server running on port 5000'));
