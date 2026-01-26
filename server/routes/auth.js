const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');


// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Register Route
router.post('/register', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'jathagam', maxCount: 1 }]), async (req, res) => {
    try {
        const {
            username, email, password, dob, gender,
            mobile,
            fatherName, motherName, familyAnnualIncome, personAnnualIncome,
            state, district, address,
            religion, caste, subCaste, gothram,
            fatherProfession, personProfession
        } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }
        // Basic mobile validation: allow digits, plus, space, hyphen; limit to 50 chars
        if (mobile && (typeof mobile !== 'string' || mobile.length > 50 || !/^\+?[0-9 \-]+$/.test(mobile))) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        // Check if user exists
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Get file paths
        const photoPath = (req.files && req.files['photo']) ? req.files['photo'][0].path : null;
        const jathagamPath = (req.files && req.files['jathagam']) ? req.files['jathagam'][0].path : null;

        let newUserId;
        try {
            newUserId = await User.createUser({
                username, mobile, email, password: hashedPassword, dob, gender,
                fatherName, motherName, familyAnnualIncome, personAnnualIncome,
                state, district, address,
                religion, caste, subCaste, gothram,
                fatherProfession, personProfession,
                photo: photoPath,
                jathagam: jathagamPath,
                status: 'Pending'
            });

            res.status(201).json({ message: 'User registered successfully.', userId: newUserId });
            return;
        } catch (e) {
            // Log full stack for debugging
            console.error('Register error:', e.stack || e);
            if ((e.message || '').toLowerCase().includes('email already exists')) {
                return res.status(400).json({ message: 'User already exists' });
            }
            // In development return stack to client for easier debugging; do not expose in production
            const payload = { message: 'Registration failed', error: e.message };
            if (process.env.NODE_ENV === 'development') payload.stack = e.stack;
            return res.status(500).json(payload);
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, mobile, password } = req.body;
        const identity = (email || mobile || '').toString().trim();
        if (!identity || !password) return res.status(400).json({ message: 'Missing credentials' });

        if (process.env.NODE_ENV === 'development') console.debug('Login attempt for identity:', identity, 'from IP:', req.ip);

        // Accept email or mobile as identity
        const user = await User.getUserByIdentity(identity);
        if (!user) {
            if (process.env.NODE_ENV === 'development') console.debug('Login failed: user not found for identity', identity);
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        if (!user.password) {
            console.error('Login failed: user has no password hash, userId=', user.Id);
            return res.status(500).json({ message: 'Server Error' });
        }

        // Warn if stored password does not look like a bcrypt hash
        if (process.env.NODE_ENV === 'development' && typeof user.password === 'string' && !user.password.startsWith('$2')) {
            console.warn('Login warning: stored password hash for userId=', user.Id, 'does not appear to be bcrypt format');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (process.env.NODE_ENV === 'development') console.debug('Password compare for userId=', user.Id, 'result=', isMatch);

        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        // Create Token (include UserType so clients can quickly check role)
        const token = jwt.sign({ id: user.Id, userType: user.UserType }, process.env.JWT_SECRET, { expiresIn: '1h' });

        if (process.env.NODE_ENV === 'development') console.debug('Login success for userId=', user.Id, 'userType=', user.UserType);

        res.json({
            token,
            user: {
                id: user.Id,
                username: user.username,
                email: user.email,
                userType: user.UserType,
                isAdmin: Number(user.UserType) === 1
            }
        });

    } catch (err) {
        console.error('Login error:', err && err.stack ? err.stack : err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Current User Route
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Remove password before sending
        if (user.password) delete user.password;
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// Dev-only: fetch user by identity (email or mobile) for debugging
router.get('/debug-user', async (req, res) => {
    if (process.env.NODE_ENV !== 'development') return res.status(404).json({ message: 'Not found' });
    const identity = (req.query.identity || '').toString().trim();
    if (!identity) return res.status(400).json({ message: 'identity query param required' });

    try {
        const user = await User.getUserByIdentity(identity);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const safe = { ...user };
        safe.hasPassword = !!safe.password;
        // never return the password hash by default
        if (safe.password) delete safe.password;
        res.json({ user: safe });
    } catch (err) {
        console.error('debug-user error:', err && err.stack ? err.stack : err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
