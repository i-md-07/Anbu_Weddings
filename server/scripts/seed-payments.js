const { poolPromise } = require('../db');
const sql = require('mssql');

async function seedPayments() {
    try {
        console.log('✅ MSSQL Connected');
        const pool = await poolPromise;

        // Get some users
        const usersRes = await pool.request().query('SELECT TOP 5 Id FROM dbo.Users');
        const userIds = usersRes.recordset.map(u => u.Id);

        if (userIds.length === 0) {
            console.log('No users found to link payments to.');
            process.exit();
        }

        const dummyPayments = [
            { amount: 1500.00, monthsToAdd: 6, status: 'Success' },
            { amount: 2500.00, monthsToAdd: 12, status: 'Success' },
            { amount: 1000.00, monthsToAdd: 3, status: 'Success' },
            { amount: 500.00, monthsToAdd: 1, status: 'Success' },
            { amount: 2000.00, monthsToAdd: 6, status: 'Success' },
        ];

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const data = dummyPayments[i % dummyPayments.length];

            const paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - (i * 2)); // Varied dates

            const expiryDate = new Date(paymentDate);
            expiryDate.setMonth(expiryDate.getMonth() + data.monthsToAdd);

            await pool.request()
                .input('UserId', sql.Int, userId)
                .input('Amount', sql.Decimal(18, 2), data.amount)
                .input('PaymentDate', sql.DateTime, paymentDate)
                .input('ExpiryDate', sql.DateTime, expiryDate)
                .input('Status', sql.NVarChar(50), data.status)
                .query(`
          INSERT INTO dbo.Payments (UserId, Amount, PaymentDate, ExpiryDate, Status, CreatedAt)
          VALUES (@UserId, @Amount, @PaymentDate, @ExpiryDate, @Status, SYSUTCDATETIME())
        `);

            console.log(`Inserted payment for user ID: ${userId}`);
        }

        console.log('Seed completed successfully.');
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        process.exit();
    }
}

seedPayments();
