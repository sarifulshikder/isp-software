async function addCustomer() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!name || !username || !password) {
        alert("সবগুলো তথ্য দিন");
        return;
    }

    try {
        // সরাসরি আইপি না দিয়ে /api/ পাথ ব্যবহার করছি যা nginx হ্যান্ডেল করবে
        const response = await fetch('/api/add-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password, profile: 'default' })
        });

        const result = await response.json();
        if (response.ok) {
            alert('✅ কাস্টমার অ্যাড হয়েছে!');
            location.reload();
        } else {
            alert('❌ এরর: ' + (result.error || 'Unknown Error'));
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। আপনার ব্রাউজার কনসোল (F12) চেক করুন।');
    }
}
