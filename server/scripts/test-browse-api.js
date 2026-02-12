const axios = require('axios');
require('dotenv').config({ path: '../.env' });

async function testBrowse() {
    try {
        // Login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'arun@gmail.com',
            password: 'Admin123!'
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        // Test 1: Minimal Browse (should fail if pagination is broken)
        console.log('Testing /api/user/browse...');
        const res1 = await axios.get('http://localhost:5000/api/user/browse', {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, pageSize: 5 }
        });
        console.log('Browse result count:', res1.data.length);

    } catch (error) {
        if (error.response) {
            console.error('Test failed with status:', error.response.status);
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Test failed:', error.message);
        }
    }
}

testBrowse();
