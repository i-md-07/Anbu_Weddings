const axios = require('axios');
const { poolPromise } = require('../db');
const bcrypt = require('bcryptjs');

const API = 'http://localhost:5000/api/auth';

async function run() {
  try {
    // Create an admin user via register endpoint
    const now = Date.now();
    const email = `admin${now}@example.com`;
    const password = 'Admin123!';

    const regRes = await axios.post(`${API}/register`, {
      username: 'Admin User',
      email,
      password
    });
    console.log('Registered user:', regRes.data);

    // Promote created user to admin using DB connection
    const pool = await poolPromise;
    const update = await pool.request()
      .input('email', require('mssql').NVarChar(255), email)
      .query('UPDATE dbo.Users SET UserType = 1 WHERE email = @email');

    console.log('Promoted to admin');

    // Login
    const loginRes = await axios.post(`${API}/login`, { email, password });
    console.log('Login:', loginRes.data.user);

    const token = loginRes.data.token;
    // Call admin endpoint
    const adminList = await axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Admin users:', adminList.data.users && adminList.data.users.length);

  } catch (err) {
    console.error('Test admin failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();
