const axios = require('axios');
const { poolPromise } = require('../db');

const AUTH_API = 'http://localhost:5000/api/auth';
const ADMIN_API = 'http://localhost:5000/api/admin';

async function run() {
  try {
    const now = Date.now();
    const email = `admin${now}@example.com`;
    const password = 'Admin123!';

    // register
    const regRes = await axios.post(`${AUTH_API}/register`, { username: 'Masters Admin', email, password });
    console.log('Registered:', regRes.data);

    // promote to admin
    const pool = await poolPromise;
    await pool.request().input('email', require('mssql').NVarChar(255), email).query('UPDATE dbo.Users SET UserType = 1 WHERE email = @email');
    console.log('Promoted to admin');

    // login
    const login = await axios.post(`${AUTH_API}/login`, { email, password });
    const token = login.data.token;
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // Create religion
    const r1 = await axios.post(`${ADMIN_API}/masters/religions`, { name: `Rel${now}` }, authHeaders);
    console.log('Created religion id', r1.data.id);

    // Get religions
    const getR = await axios.get(`${ADMIN_API}/masters/religions`, authHeaders);
    console.log('Religions count:', getR.data.religions.length);
    const rid = r1.data.id;

    // Create caste
    const c1 = await axios.post(`${ADMIN_API}/masters/religions/${rid}/castes`, { name: `Caste${now}` }, authHeaders);
    console.log('Created caste id', c1.data.id);
    const cid = c1.data.id;

    // Create subcaste
    const s1 = await axios.post(`${ADMIN_API}/masters/castes/${cid}/subcastes`, { name: `Sub${now}` }, authHeaders);
    console.log('Created subcaste id', s1.data.id);
    const sid = s1.data.id;

    // Update names
    await axios.put(`${ADMIN_API}/masters/religions/${rid}`, { name: `Rel${now}-up` }, authHeaders);
    await axios.put(`${ADMIN_API}/masters/castes/${cid}`, { name: `Caste${now}-up` }, authHeaders);
    await axios.put(`${ADMIN_API}/masters/subcastes/${sid}`, { name: `Sub${now}-up` }, authHeaders);
    console.log('Updated names');

    // Read back
    const castes = await axios.get(`${ADMIN_API}/masters/religions/${rid}/castes`, authHeaders);
    console.log('Castes now:', castes.data.castes.map(c=>c.Name));
    const subcastes = await axios.get(`${ADMIN_API}/masters/castes/${cid}/subcastes`, authHeaders);
    console.log('SubCastes now:', subcastes.data.subcastes.map(s=>s.Name));

    // Delete subcaste, caste, religion
    await axios.delete(`${ADMIN_API}/masters/subcastes/${sid}`, authHeaders);
    await axios.delete(`${ADMIN_API}/masters/castes/${cid}`, authHeaders);
    await axios.delete(`${ADMIN_API}/masters/religions/${rid}`, authHeaders);
    console.log('Deleted created masters');

    console.log('Masters tests passed');
  } catch (err) {
    console.error('Masters test failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();