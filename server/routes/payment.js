const router = require('express').Router();
const { poolPromise } = require('../db');
const jwt = require('jsonwebtoken');

// POST /api/payment/process
router.post('/process', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { amount } = req.body;
        // Basic validation
        if (!amount) return res.status(400).json({ message: 'Amount is required' });

        const pool = await poolPromise;

        // Calculate Expiry Date: Now + 6 Months
        // We can do this in SQL or JS. JS is easier to control.
        const now = new Date();
        const expiryDate = new Date(now.setMonth(now.getMonth() + 6));

        // Transaction to ensure both payment record and user update happen or fail together
        const transaction = new (require('mssql')).Transaction(pool);

        await transaction.begin();

        try {
            const request = new (require('mssql')).Request(transaction);

            // 1. Insert Payment Record
            await request
                .input('UserId', require('mssql').Int, userId)
                .input('Amount', require('mssql').Decimal(18, 2), amount)
                .input('ExpiryDate', require('mssql').DateTime, expiryDate)
                .input('Status', require('mssql').NVarChar(50), 'Success')
                .query(`
                    INSERT INTO dbo.Payments (UserId, Amount, PaymentDate, ExpiryDate, Status)
                    VALUES (@UserId, @Amount, SYSUTCDATETIME(), @ExpiryDate, @Status)
                `);

            // 2. Update User ExpiryDate. 
            // Note: Does this make them Active? 
            // User prompt: "once admin verified then admin have option to approve that user and make it as active"
            // "create one table for payment ... and expiry date ... if expaired date > current ... make it as expaired"
            // It implies payment sets the expiry date. If they were Pending, maybe they stay Pending until Admin approves?
            // Or if they were Active and Expired, this renews them?
            // Let's assume this just updates ExpiryDate. If they are 'Expired', maybe we should set them back to 'Active' IF they were previously approved?
            // For now simplest interpretation: Update ExpiryDate. If Status is 'Expired', set to 'Active' (assuming they paid to renew).
            // But if they are 'Pending', let admin approve.

            // Logic: Update ExpiryDate. Set Status = 'Active' CASE WHEN Status = 'Expired' ELSE Status END

            await request.query(`
                UPDATE dbo.Users 
                SET ExpiryDate = @ExpiryDate,
                    Status = CASE WHEN Status = 'Expired' THEN 'Active' ELSE Status END,
                    UpdatedAt = SYSUTCDATETIME()
                WHERE Id = @UserId
            `);

            await transaction.commit();
            res.json({ message: 'Payment successful', expiryDate });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error('Payment error:', err);
        res.status(500).json({ message: 'Payment processing failed' });
    }
});

module.exports = router;
