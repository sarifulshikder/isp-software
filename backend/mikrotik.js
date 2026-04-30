const Mikronode = require('mikronode');

const connectMikrotik = async () => {
    const device = new Mikronode('YOUR_MIKROTIK_IP'); // এখানে মাইক্রোটিক আইপি দিন
    
    try {
        const [client] = await device.connect('admin', 'your_password'); // ইউজার ও পাসওয়ার্ড
        console.log("✅ Connected to MikroTik Router via API");
        return client;
    } catch (err) {
        console.error("❌ MikroTik Connection Failed:", err);
        return null;
    }
};

module.exports = connectMikrotik;
