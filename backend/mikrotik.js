const { RouterOSAPI } = require('routeros-client');

const connectMikrotik = async () => {
    const api = new RouterOSAPI({
        host: '10.5.50.1', // আপনার মাইক্রোটিক আইপি
        user: 'admin',
        password: 'your_password', // এখানে আপনার মাইক্রোটিক পাসওয়ার্ড দিন
        port: 8728
    });

    try {
        await api.connect();
        console.log("✅ Connected to MikroTik via routeros-client");
        return api;
    } catch (err) {
        console.error("❌ MikroTik Connection Failed:", err);
        return null;
    }
};

module.exports = connectMikrotik;
