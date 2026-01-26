const axios = require('axios');

async function run() {
  try {
    const ts = Date.now();
    const user = {
      username: `Test User ${ts}`,
      mobile: '+911234567890',
      email: `sp_test_${ts}@example.com`,
      password: '123456',
      dob: '1990-01-01'
    };

    console.log('Sending register request:', user.email);
    const res = await axios.post('http://localhost:5000/api/auth/register', user, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response status:', err.response.status);
      console.error('Error response data:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
}

run();
