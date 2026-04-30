const { RouterOSAPI } = require('routeros-client');

const connectMikrotik = async () => {
    const api = new RouterOSAPI({
        host: '10.5.50.1',
        user: 'admin', // নিশ্চিত করুন এটি সঠিক কি না
        password: 'Sa983106', // এখানে সঠিক পাসওয়ার্ড দিন
        port: 8728
    });

    try {
        await api.connect();
        console.log("✅ MikroTik Connected!");
        return api;
    } catch (err) {
        console.error("❌ MikroTik Connection Failed:", err.message);
        return null;
    }
};

module.exports = connectMikrotik;
