async function addCustomer() {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/add-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, profile: 'default' })
    });

    const result = await response.json();
    if (result.message) {
        alert('Customer Synced with MikroTik!');
        location.reload();
    } else {
        alert('Error: ' + result.error);
    }
}
