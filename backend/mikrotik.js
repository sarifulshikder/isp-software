const Mikronode = require('mikronode');

const connectMikrotik = async () => {
    const device = new Mikronode('10.5.50.1'); // আপনার মাইক্রোটিক আইপি
    
    return new Promise((resolve, reject) => {
        device.connect('admin', 'Sa983106') // আপনার ইউজার ও পাসওয়ার্ড
            .then(([client]) => {
                console.log("✅ Connected to MikroTik Router");
                resolve(client);
            })
            .catch(err => {
                console.error("❌ MikroTik Connection Failed:", err);
                resolve(null);
            });
    });
};

module.exports = connectMikrotik;
