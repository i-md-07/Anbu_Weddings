const axios = require('axios');

async function testFilters() {
    try {
        // Login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'arun@gmail.com',
            password: 'Admin123!'
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        // Test 1: No filters
        const res1 = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('No filters:', res1.data.totalCount);

        // Test 2: State filter
        const res2 = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
            params: { states: 'Tamil Nadu' }
        });
        console.log('Filter State=Tamil Nadu:', res2.data.totalCount);

        // Test 3: Multiple states
        const res3 = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
            params: { states: 'Tamil Nadu,TN' }
        });
        console.log('Filter State=Tamil Nadu,TN:', res3.data.totalCount);

        // Test 4: Religion filter
        const res4 = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
            params: { religions: 'Hindu' }
        });
        console.log('Filter Religion=Hindu:', res4.data.totalCount);

    } catch (error) {
        console.error('Test failed:', error.response ? error.response.data : error.message);
    }
}

testFilters();
