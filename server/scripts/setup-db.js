const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { poolPromise } = require('../db');

async function run() {
  try {
    const pool = await poolPromise;
    const sqlFile = fs.readFileSync(path.join(__dirname, '..', 'sql', 'mssql_setup.sql'), 'utf8');

    // Split on GO statements (case-insensitive) and execute each batch
    const batches = sqlFile.split(/^\s*GO\s*$/gim);
    for (const batch of batches) {
      const trimmed = batch.trim();
      if (!trimmed) continue;
      console.log('Running batch...');
      try {
        await pool.request().batch(trimmed);
      } catch (batchErr) {
        // Log and continue on batch-level errors (e.g., drop non-existent proc or permission warnings)
        console.warn('Batch error (continuing):', batchErr && batchErr.message ? batchErr.message : batchErr);
        continue;
      }
    }
    console.log('Database setup finished');
    process.exit(0);
  } catch (err) {
    console.error('Error running setup script:', err);
    process.exit(1);
  }
}

run();
