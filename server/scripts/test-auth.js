const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API = 'http://localhost:5000/api/auth';

async function run() {
  try {
    const form = new FormData();
    form.append('username', 'Automated Test');
    form.append('email', `autotest${Date.now()}@example.com`);
    form.append('password', 'Password!23');
    form.append('dob', '1990-01-01');

    // optional file attachments can be added here, but not necessary

    const regRes = await axios.post(`${API}/register`, form, { headers: form.getHeaders() });
    console.log('Register:', regRes.data);
    const id = regRes.data.userId;

    const loginRes = await axios.post(`${API}/login`, {
      email: form.get('email'),
      password: 'Password!23'
    });
    console.log('Login:', loginRes.data);

    const token = loginRes.data.token;
    const me = await axios.get(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Me:', me.data);
  } catch (err) {
    console.error('Test auth failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();
