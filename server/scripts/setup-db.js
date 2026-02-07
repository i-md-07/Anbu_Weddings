const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { poolPromise } = require('../db');

async function run() {
  try {
    const pool = await poolPromise;
    const sqlFiles = [
      'mssql_setup.sql',
      'create_users_table.sql',
      '../db_migration.sql', // at root relative to /sql
      'create_dashboard_tables.sql'
    ];

    for (const fileName of sqlFiles) {
      const filePath = path.join(__dirname, '..', 'sql', fileName);
      console.log(`Processing ${fileName}...`);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}, skipping.`);
        continue;
      }

      const sqlContent = fs.readFileSync(filePath, 'utf8');
      const batches = sqlContent.split(/^\s*GO\s*$/gim);

      for (const batch of batches) {
        const trimmed = batch.trim();
        if (!trimmed) continue;
        try {
          await pool.request().batch(trimmed);
        } catch (batchErr) {
          console.warn(`Batch error in ${fileName} (continuing):`, batchErr.message);
        }
      }
      console.log(`Finished ${fileName}`);
    }
    console.log('Database initialization finished');
    process.exit(0);
  } catch (err) {
    console.error('Error running setup script:', err);
    process.exit(1);
  }
}

run();
