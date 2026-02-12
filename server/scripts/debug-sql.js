const axios = require('axios');
require('dotenv').config({ path: '../.env' });

async function runTests() {
    const baseURL = 'http://localhost:5000/api';
    let token;

    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${baseURL}/auth/login`, {
            email: 'arun@gmail.com',
            password: 'Admin123!'
        });
        token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        console.log('--- Testing Unique Values ---');
        try {
            const uvRes = await axios.get(`${baseURL}/admin/users/unique-values`);
            console.log('Unique Values Success:', Object.keys(uvRes.data));
        } catch (err) {
            console.error('Unique Values Failed:', err.response?.data || err.message);
        }

        console.log('--- Testing Browse Profiles ---');
        try {
            const bRes = await axios.get(`${baseURL}/user/browse`, { headers });
            console.log('Browse Success, count:', bRes.data.length);
        } catch (err) {
            console.error('Browse Failed:', err.response?.data || err.message);
        }

        console.log('--- Testing Dashboard Stats ---');
        try {
            const dsRes = await axios.get(`${baseURL}/user/dashboard-stats`, { headers });
            console.log('Dashboard Stats Success');
        } catch (err) {
            console.error('Dashboard Stats Failed:', err.response?.data || err.message);
        }

    } catch (err) {
        console.error('Main Test Script Failed:', err.message);
    }
}

runTests();
