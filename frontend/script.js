async function addCustomer() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!name || !username || !password) {
        alert("দয়া করে সব ঘর পূরণ করুন!");
        return;
    }

    try {
        const response = await fetch('/api/add-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password, profile: 'default' })
        });

        if (response.ok) {
            alert('✅ সফলভাবে অ্যাড হয়েছে!');
            document.getElementById('name').value = '';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            loadCustomers(); // লিস্ট রিফ্রেশ করা
        } else {
            const err = await response.json();
            alert('❌ ভুল হয়েছে: ' + err.error);
        }
    } catch (e) {
        alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না!');
    }
}

async function loadCustomers() {
    try {
        const response = await fetch('/api/customers');
        const customers = await response.json();
        const tableBody = document.getElementById('customerTableBody');
        tableBody.innerHTML = '';

        customers.forEach(user => {
            tableBody.innerHTML += `
                <tr>
                    <td>${user.name || 'N/A'}</td>
                    <td><b>${user.username}</b></td>
                    <td>${user.profile || 'default'}</td>
                    <td><span class="badge bg-success">Active</span></td>
                    <td><button class="btn btn-sm btn-outline-danger">Disable</button></td>
                </tr>`;
        });
    } catch (e) {
        console.error('লিস্ট লোড করতে সমস্যা হয়েছে');
    }
}

window.onload = loadCustomers;
