const axios = require('axios');

async function testDashboard() {
    const token = 'YOUR_TOKEN_HERE'; // Manual test: get token from browser after login
    const baseURL = 'http://localhost:5000/api/user';

    try {
        console.log('Testing Dashboard Stats...');
        const stats = await axios.get(`${baseURL}/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Stats:', stats.data);

        console.log('Testing Recommendations...');
        const recs = await axios.get(`${baseURL}/recommendations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Recommendations Count:', recs.data.length);

        console.log('Testing Shortlists...');
        const shorts = await axios.get(`${baseURL}/shortlists`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Shortlists Count:', shorts.data.length);

    } catch (err) {
        console.error('Error testing dashboard:', err.response ? err.response.data : err.message);
    }
}

// testDashboard(); // Uncomment to run manually
console.log('Verification script ready. To run, add a valid token and uncomment testDashboard().');
