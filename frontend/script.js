async function addCustomer() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!name || !username || !password) { alert("সবগুলো ঘর পূরণ করুন!"); return; }

    try {
        const response = await fetch('/api/add-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password, profile: 'default' })
        });
        if (response.ok) { 
            alert('✅ Success!'); 
            loadCustomers(); // লিস্ট আপডেট করা
        } else { 
            alert('❌ Error adding customer'); 
        }
    } catch (e) { alert('Connection Failed!'); }
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
                    <td>${user.name}</td>
                    <td><b>${user.username}</b></td>
                    <td>${user.profile}</td>
                    <td><span class="badge bg-success">Active</span></td>
                    <td><button class="btn btn-sm btn-danger">Disable</button></td>
                </tr>`;
        });
    } catch (e) { console.error('Failed to load customers'); }
}

// পেজ লোড হলে লিস্ট দেখাও
window.onload = loadCustomers;
