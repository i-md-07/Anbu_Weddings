const { poolPromise, sql } = require('../db');

/**
 * Users model functions using stored procedures:
 * - sp_register_user
 * - sp_get_user_by_email
 * - sp_get_user_by_id
 */

async function createUser(user) {
    const pool = await poolPromise;
    const request = pool.request();

    // Inputs (use NVARCHAR for text, DATETIME for dob)
    request.input('username', sql.NVarChar(255), user.username);
    request.input('mobile', sql.NVarChar(50), user.mobile);
    request.input('email', sql.NVarChar(255), user.email);
    request.input('password', sql.NVarChar(255), user.password);
    request.input('dob', sql.Date, user.dob ? new Date(user.dob) : null);
    request.input('gender', sql.NVarChar(50), user.gender);
    request.input('fatherName', sql.NVarChar(255), user.fatherName);
    request.input('motherName', sql.NVarChar(255), user.motherName);
    request.input('familyAnnualIncome', sql.NVarChar(100), user.familyAnnualIncome);
    request.input('personAnnualIncome', sql.NVarChar(100), user.personAnnualIncome);
    request.input('state', sql.NVarChar(100), user.state);
    request.input('district', sql.NVarChar(100), user.district);
    request.input('address', sql.NVarChar(500), user.address);
    request.input('religion', sql.NVarChar(100), user.religion);
    request.input('caste', sql.NVarChar(100), user.caste);
    request.input('subCaste', sql.NVarChar(100), user.subCaste);
    request.input('gothram', sql.NVarChar(100), user.gothram);
    request.input('FatherProfession', sql.NVarChar(100), user.fatherProfession);
    request.input('PersonProfession', sql.NVarChar(100), user.personProfession);
    request.input('photo', sql.NVarChar(500), user.photo);
    request.input('jathagam', sql.NVarChar(500), user.jathagam);
    // IsApproved defaults to false (0) and UserType defaults to 0 (regular user)
    request.input('IsApproved', sql.Bit, typeof user.isApproved === 'boolean' ? (user.isApproved ? 1 : 0) : 0);
    request.input('UserType', sql.Int, typeof user.userType === 'number' ? user.userType : 0);
    request.input('Status', sql.NVarChar(50), user.status || 'Pending');
    request.input('ExpiryDate', sql.DateTime, user.expiryDate ? new Date(user.expiryDate) : null);

    try {
        const result = await request.execute('sp_register_user');
        const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
        if (!row) throw new Error('Registration failed: no response from DB');
        if (row.status <= 0) {
            throw new Error('Registration failed: ' + (row.message || 'unknown'));
        }
        return row.id;
    } catch (err) {
        // If the stored procedure on the database does not yet accept the `mobile` parameter
        // (older setup), SQL Server will return an error like "Procedure or function 'sp_register_user' has too many arguments specified.".
        // In that case, try a more robust compatibility attempt: query the stored procedure's parameters and call with only supported inputs.
        const msg = (err && err.message) ? err.message : '';
        if (msg.toLowerCase().includes('too many arguments')) {
            try {
                const paramsRes = await pool.request().query("SELECT name FROM sys.parameters WHERE object_id = OBJECT_ID('dbo.sp_register_user') ORDER BY parameter_id");
                const paramNames = (paramsRes.recordset || []).map(r => r.name.replace('@', ''));

                const retryReq = pool.request();
                const addIfExists = (param, type, value) => {
                    if (paramNames.includes(param)) retryReq.input(param, type, value);
                };

                addIfExists('username', sql.NVarChar(255), user.username);
                addIfExists('mobile', sql.NVarChar(50), user.mobile);
                addIfExists('email', sql.NVarChar(255), user.email);
                addIfExists('password', sql.NVarChar(255), user.password);
                addIfExists('dob', sql.Date, user.dob ? new Date(user.dob) : null);
                addIfExists('gender', sql.NVarChar(50), user.gender);
                addIfExists('fatherName', sql.NVarChar(255), user.fatherName);
                addIfExists('motherName', sql.NVarChar(255), user.motherName);
                addIfExists('familyAnnualIncome', sql.NVarChar(100), user.familyAnnualIncome);
                addIfExists('personAnnualIncome', sql.NVarChar(100), user.personAnnualIncome);
                addIfExists('state', sql.NVarChar(100), user.state);
                addIfExists('district', sql.NVarChar(100), user.district);
                addIfExists('address', sql.NVarChar(500), user.address);
                addIfExists('religion', sql.NVarChar(100), user.religion);
                addIfExists('caste', sql.NVarChar(100), user.caste);
                addIfExists('subCaste', sql.NVarChar(100), user.subCaste);
                addIfExists('gothram', sql.NVarChar(100), user.gothram);
                addIfExists('FatherProfession', sql.NVarChar(100), user.fatherProfession);
                addIfExists('PersonProfession', sql.NVarChar(100), user.personProfession);
                addIfExists('photo', sql.NVarChar(500), user.photo || null);
                addIfExists('jathagam', sql.NVarChar(500), user.jathagam || null);
                addIfExists('IsApproved', sql.Bit, typeof user.isApproved === 'boolean' ? (user.isApproved ? 1 : 0) : 0);
                addIfExists('UserType', sql.Int, typeof user.userType === 'number' ? user.userType : 0);
                addIfExists('Status', sql.NVarChar(50), user.status || 'Pending');
                addIfExists('ExpiryDate', sql.DateTime, user.expiryDate ? new Date(user.expiryDate) : null);

                const retryResult = await retryReq.execute('sp_register_user');
                const row = retryResult.recordset && retryResult.recordset[0] ? retryResult.recordset[0] : null;
                if (!row) throw new Error('Registration failed (retry): no response from DB');
                if (row.status <= 0) throw new Error('Registration failed (retry): ' + (row.message || 'unknown'));
                return row.id;
            } catch (diagErr) {
                console.error('Registration retry with proc-compat failed:', diagErr && diagErr.message ? diagErr.message : diagErr);
                // Also include original DB message for context
                console.error('Original DB error:', err && err.message ? err.message : err);
                throw err; // rethrow original
            }
        }
        // If not a compatibility error, rethrow
        throw err;
    }
}

async function getUserByEmail(email) {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('email', sql.NVarChar(255), email);
    const result = await request.execute('sp_get_user_by_email');
    return result.recordset && result.recordset[0] ? result.recordset[0] : null;
}

// Helper to find user by either email or mobile (identity)
async function getUserByIdentity(identity) {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('identity', sql.NVarChar(255), identity);

    // Try exact match first
    let result = await request.query('SELECT * FROM dbo.Users WHERE email = @identity OR mobile = @identity');
    if (result.recordset && result.recordset[0]) return result.recordset[0];

    // If identity looks like a phone number, try normalized comparison (strip spaces, +, -)
    const phoneLike = /^[+0-9 \-()]+$/.test(identity);
    if (phoneLike) {
        // Normalize by removing spaces, plus, hyphens, and parentheses
        const normalizedQuery = `SELECT * FROM dbo.Users WHERE email = @identity OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(mobile,' ',''),'-',''),'+',''),'(',''),')','') = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(@identity,' ',''),'-',''),'+',''),'(',''),')','')`;
        const normResult = await pool.request().input('identity', sql.NVarChar(255), identity).query(normalizedQuery);
        if (normResult.recordset && normResult.recordset[0]) return normResult.recordset[0];
    }

    // Not found
    return null;
}

async function getUserById(id) {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('id', sql.Int, id);
    const result = await request.execute('sp_get_user_by_id');
    return result.recordset && result.recordset[0] ? result.recordset[0] : null;
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getUserByIdentity
};
