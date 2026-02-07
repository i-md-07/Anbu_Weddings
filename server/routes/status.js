const router = require('express').Router();
const { poolPromise } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 AS ok');
    res.json({ ok: true, db: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/db-columns', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users'");
    res.json({ columns: result.recordset.map(r => r.COLUMN_NAME) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/db-details', async (req, res) => {
  try {
    const pool = await poolPromise;
    const proc = await pool.request().query("SELECT p.name, COUNT(pa.parameter_id) AS param_count FROM sys.procedures p LEFT JOIN sys.parameters pa ON pa.object_id = p.object_id AND pa.system_type_id IS NOT NULL WHERE p.name = 'sp_register_user' GROUP BY p.name");
    const hasProc = proc.recordset && proc.recordset[0];
    res.json({ sp_register_user: hasProc ? { name: hasProc.name, param_count: hasProc.param_count } : null });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
