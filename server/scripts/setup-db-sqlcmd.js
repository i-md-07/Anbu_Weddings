const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// This script assumes `sqlcmd` is installed and available in PATH (SQL Server Tools)
// Use Windows Integrated Auth (-E) or SQL Auth (-U / -P)

const sqlFile = path.join(__dirname, '..', 'sql', 'mssql_setup.sql');

function runSqlCmdWin() {
  const server = process.env.DB_SERVER || 'localhost';
  // Use Windows auth
  const cmd = `sqlcmd -S "${server}" -E -i "${sqlFile}"`;
  console.log('Running:', cmd);
  const p = exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('sqlcmd failed:', err.message);
      console.error('stderr:', stderr);
      process.exit(1);
    }
    console.log('stdout:', stdout);
    console.log('SQL script executed successfully');
  });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}

function runSqlCmdSqlAuth() {
  const server = process.env.DB_SERVER || 'localhost';
  const user = process.env.DB_USER || 'sa';
  const pass = process.env.DB_PASSWORD || '';
  const cmd = `sqlcmd -S "${server}" -U "${user}" -P "${pass}" -i "${sqlFile}"`;
  console.log('Running:', cmd.replace(/-P \".*\"/, '-P "****"'));
  const p = exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('sqlcmd failed:', err.message);
      console.error('stderr:', stderr);
      process.exit(1);
    }
    console.log('stdout:', stdout);
    console.log('SQL script executed successfully');
  });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}

if (process.env.USE_WINDOWS_AUTH === 'true') runSqlCmdWin(); else runSqlCmdSqlAuth();
