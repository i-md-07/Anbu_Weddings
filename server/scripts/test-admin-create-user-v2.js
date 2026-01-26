const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { poolPromise } = require('../db');

async function testAdminCreate() {
    try {
        console.log('--- Starting Admin Create User Test ---');

        // 1. Prepare Admin User
        const adminEmail = 'admin_test@vows.com';
        const password = 'Password@123';

        console.log('Checking for admin user...');
        const pool = await poolPromise;
        let admin = await pool.request()
            .input('email', require('mssql').NVarChar(255), adminEmail)
            .query('SELECT Id, UserType FROM dbo.Users WHERE email = @email');

        if (admin.recordset.length === 0) {
            console.log('Admin user not found, please ensure it exists or run a registration script first.');
            // For testing purposes, we can try to find ANY admin
            admin = await pool.request().query('SELECT TOP 1 Id, email FROM dbo.Users WHERE UserType = 1');
            if (admin.recordset.length === 0) {
                throw new Error('No admin user found in database to perform test.');
            }
            console.log(`Using admin: ${admin.recordset[0].email}`);
        } else {
            console.log(`Using admin: ${adminEmail}`);
        }

        // 2. Login as Admin
        console.log('Logging in as admin...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: admin.recordset[0].email || adminEmail,
            password: password
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 3. Create User via Admin (multipart/form-data)
        console.log('Creating new user via admin...');

        // axios 1.x automatically handles FormData in Node.js if passed as data
        const FormData = require('form-data'); // Might need this if axios automatic doesn't work well
        const form = new FormData();

        const newUser = {
            name: 'Test Create ' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'User@123',
            mobile: '9876543210',
            username: 'testuser' + Date.now()
        };

        form.append('username', newUser.username);
        form.append('email', newUser.email);
        form.append('password', newUser.password);
        form.append('mobile', newUser.mobile);
        form.append('name', newUser.name);
        form.append('isApproved', '1');

        // Add dummy files
        const dummyPhoto = Buffer.from('dummy photo content');
        const dummyJathagam = Buffer.from('dummy jathagam content');

        form.append('photo', dummyPhoto, 'photo.jpg');
        form.append('jathagam', dummyJathagam, 'jathagam.txt');

        const response = await axios.post('http://localhost:5000/api/admin/users', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('User created successfully. ID:', response.data.userId);

        // 4. Verify in DB
        const checkUser = await pool.request()
            .input('id', require('mssql').Int, response.data.userId)
            .query('SELECT username, email, photo, jathagam FROM dbo.Users WHERE Id = @id');

        console.log('User in DB:', checkUser.recordset[0]);

        if (checkUser.recordset[0].photo && checkUser.recordset[0].jathagam) {
            console.log('✅ TEST PASSED: User created with file paths.');
        } else {
            console.log('❌ TEST FAILED: User created but file paths are missing.');
        }

    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    } finally {
        process.exit();
    }
}

testAdminCreate();
