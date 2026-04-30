async function addCustomer() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!name || !username || !password) {
        alert("সবগুলো তথ্য দিন");
        return;
    }

    try {
        const response = await fetch('http://103.164.50.8:5000/add-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password, profile: 'default' })
        });

        const result = await response.json();
        if (response.ok) {
            alert('✅ কাস্টমার অ্যাড হয়েছে!');
            location.reload();
        } else {
            alert('❌ এরর: ' + result.error);
        }
    } catch (error) {
        alert('সার্ভারে সমস্যা হয়েছে। কন্সোল চেক করুন।');
    }
}
