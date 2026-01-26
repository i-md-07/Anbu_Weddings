const { poolPromise } = require('../db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        console.log('✅ MSSQL Connected');
        const pool = await poolPromise;
        const email = 'admin_test@vows.com';
        const password = 'Password@123';
        const mobile = '0000000000';
        const hashed = await bcrypt.hash(password, 10);

        // Check if exists
        const exists = await pool.request().input('email', require('mssql').NVarChar(255), email).query('SELECT Id FROM dbo.Users WHERE email = @email');

        if (exists.recordset.length > 0) {
            await pool.request()
                .input('email', require('mssql').NVarChar(255), email)
                .input('password', require('mssql').NVarChar(255), hashed)
                .query("UPDATE dbo.Users SET password = @password, UserType = 1, Status = 'Active', IsApproved = 1 WHERE email = @email");
            console.log('Admin updated.');
        } else {
            await pool.request()
                .input('username', require('mssql').NVarChar(255), 'Admin Test')
                .input('email', require('mssql').NVarChar(255), email)
                .input('mobile', require('mssql').NVarChar(50), mobile)
                .input('password', require('mssql').NVarChar(255), hashed)
                .query("INSERT INTO dbo.Users (username, mobile, email, password, UserType, IsApproved, Status, CreatedAt, UpdatedAt) VALUES (@username, @mobile, @email, @password, 1, 1, 'Active', SYSUTCDATETIME(), SYSUTCDATETIME())");
            console.log('Admin created.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

createAdmin();
