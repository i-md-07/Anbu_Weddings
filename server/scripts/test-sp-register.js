const { poolPromise, sql } = require('../db');

async function run() {
  try {
    const ts = Date.now();
    const email = `sp_direct_${ts}@example.com`;
    const pool = await poolPromise;
    const req = pool.request();
    req.input('username', sql.NVarChar(255), `SP Test ${ts}`);
    req.input('mobile', sql.NVarChar(50), '+911234567890');
    req.input('email', sql.NVarChar(255), email);
    req.input('password', sql.NVarChar(255), 'HASHED_PLACEHOLDER');
    req.input('dob', sql.Date, '1990-01-01');

    console.log('Calling sp_register_user directly with email:', email);
    const result = await req.execute('sp_register_user');
    console.log('Result recordset:', result.recordset);
  } catch (err) {
    console.error('SP call failed:', err.message || err);
    if (err && err.originalError) console.error('Original:', err.originalError.message || err.originalError);
    process.exit(1);
  }
}

run();
