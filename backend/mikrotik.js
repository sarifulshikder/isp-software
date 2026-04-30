const Mikronode = require('mikronode');

const connectMikrotik = async () => {
    // এখানে '192.168.88.1' এর জায়গায় আপনার মাইক্রোটিকের রিয়েল আইপি দিন
    const device = new Mikronode('10.5.50.1'); 
    
    try {
        // এখানে 'admin' এবং 'your_password' এর জায়গায় আপনার লগইন তথ্য দিন
        const [client] = await device.connect('admin', 'Sa983106'); 
        console.log("✅ Connected to MikroTik Router via API");
        return client;
    } catch (err) {
        console.error("❌ MikroTik Connection Failed:", err);
        return null;
    }
};

module.exports = connectMikrotik;
