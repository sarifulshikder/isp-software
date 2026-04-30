const express = require('express');
const cors = require('cors');
const pool = require('./db');
const connectMikrotik = require('./mikrotik');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/add-customer', async (req, res) => {
    const { name, username, password, profile } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password required' });
    }

    try {
        // ১. ডাটাবেসে সেভ
        await pool.query(
            'INSERT INTO customers (name, username, password, profile) VALUES ($1, $2, $3, $4)',
            [name || '', username, password, profile || 'default']
        );

        // ২. মাইক্রোটিকে সেভ
        const api = await connectMikrotik();
        if (api) {
            // MikroTik API এর একদম সঠিক কমান্ড ফরম্যাট
            await api.write([
                '/ppp/secret/add',
                '=name=' + String(username),
                '=password=' + String(password),
                '=profile=' + String(profile || 'default'),
                '=service=pppoe',
                '=comment=' + String(name || '')
            ]);
            
            api.close();
            console.log("✅ MikroTik-এ ইউজার যোগ হয়েছে:", username);
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(500).json({ error: 'MikroTik কানেকশন পাওয়া যায়নি' });
        }
    } catch (err) {
        console.error("❌ MikroTik API Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
