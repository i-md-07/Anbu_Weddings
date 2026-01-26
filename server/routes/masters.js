const router = require('express').Router();
const { poolPromise } = require('../db');

// GET ALL RELIGIONS (Public)
router.get('/religions', async (req, res) => {
    try {
        const pool = await poolPromise;
        // Using the same stored proc as admin, assuming it just selects data
        const result = await pool.request().execute('sp_Masters_Religions_GetAll');
        res.json({ religions: result.recordset });
    } catch (err) {
        console.error('Get religions error', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET CASTES BY RELIGION (Public)
router.get('/religions/:id/castes', async (req, res) => {
    try {
        const religionId = parseInt(req.params.id, 10);
        const pool = await poolPromise;

        const result = await pool.request()
            .input('ReligionId', require('mssql').Int, religionId)
            .query(`
        SELECT Id, Name
        FROM dbo.Masters_Castes
        WHERE ReligionId = @ReligionId
        ORDER BY Name ASC
      `);

        res.json({ castes: result.recordset });
    } catch (err) {
        console.error('Get castes error', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET SUBCASTES BY CASTE (Public)
router.get('/castes/:id/subcastes', async (req, res) => {
    try {
        const casteId = parseInt(req.params.id, 10);
        const pool = await poolPromise;

        const result = await pool.request()
            .input('CasteId', require('mssql').Int, casteId)
            .query(`
          SELECT Id, Name
          FROM dbo.Masters_SubCastes
          WHERE CasteId = @CasteId
          ORDER BY Name ASC
        `);

        res.json({ subcastes: result.recordset });
    } catch (err) {
        console.error('Get subcastes error', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
