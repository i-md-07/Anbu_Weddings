const router = require('express').Router();
const { poolPromise, sql } = require('../db');
const jwt = require('jsonwebtoken');
const Interaction = require('../models/Interaction');

// Middleware to verify user token
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// GET /api/user/dashboard-stats
router.get('/dashboard-stats', authenticateUser, async (req, res) => {
    try {
        const stats = await Interaction.getDashboardStats(req.user.id);
        res.json(stats);
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/user/recommendations
router.get('/recommendations', authenticateUser, async (req, res) => {
    try {
        const pool = await poolPromise;
        const userId = req.user.id;

        // Fetch current user's details to find matches
        const userResult = await pool.request().input('userId', sql.Int, userId).query('SELECT gender, religion, caste FROM dbo.Users WHERE Id = @userId');
        const user = userResult.recordset[0];

        if (!user) return res.status(404).json({ message: 'User not found' });

        const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';

        const recommendations = await pool.request()
            .input('userId', sql.Int, userId)
            .input('gender', sql.NVarChar, oppositeGender)
            .input('religion', sql.NVarChar, user.religion)
            .query(`
                SELECT TOP 10 Id, username, dob, PersonProfession, district, religion, photo
                FROM dbo.Users 
                WHERE Id != @userId AND gender = @gender AND IsApproved = 1
                ORDER BY CASE WHEN religion = @religion THEN 0 ELSE 1 END, CreatedAt DESC
            `);

        const formatted = recommendations.recordset.map(r => ({
            id: r.Id,
            name: r.username,
            age: r.dob ? new Date().getFullYear() - new Date(r.dob).getFullYear() : 'N/A',
            profession: r.PersonProfession || 'Not specified',
            city: r.district || 'N/A',
            matchScore: 90, // Placeholder
            image: r.photo ? `http://localhost:5000/${r.photo}` : "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Recommendations error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/user/shortlists
router.get('/shortlists', authenticateUser, async (req, res) => {
    try {
        const shortlists = await Interaction.getShortlists(req.user.id);
        const formatted = shortlists.map(r => ({
            id: r.Id,
            name: r.username,
            age: r.dob ? new Date().getFullYear() - new Date(r.dob).getFullYear() : 'N/A',
            profession: r.PersonProfession || 'Not specified',
            image: r.photo ? `http://localhost:5000/${r.photo}` : "https://images.unsplash.com/photo-1710425804836-a1de39056b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
        }));
        res.json(formatted);
    } catch (err) {
        console.error('Shortlists error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/user/shortlist
router.post('/shortlist', authenticateUser, async (req, res) => {
    try {
        const { profileId } = req.body;
        const action = await Interaction.toggleShortlist(req.user.id, profileId);
        res.json({ message: `Profile ${action}`, action });
    } catch (err) {
        console.error('Toggle shortlist error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/user/interest
router.post('/interest', authenticateUser, async (req, res) => {
    try {
        const { receiverId } = req.body;
        await Interaction.sendInterest(req.user.id, receiverId);
        res.json({ message: 'Interest sent' });
    } catch (err) {
        console.error('Send interest error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/user/record-view
router.post('/record-view', authenticateUser, async (req, res) => {
    try {
        const { profileId } = req.body;
        await Interaction.recordView(req.user.id, profileId);
        res.json({ message: 'View recorded' });
    } catch (err) {
        console.error('Record view error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/user/recent-activity
router.get('/recent-activity', authenticateUser, async (req, res) => {
    try {
        const activity = await Interaction.getRecentActivity(req.user.id);
        res.json(activity);
    } catch (err) {
        console.error('Recent activity error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/user/browse - dynamically fetch profiles
router.get('/browse', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        // Fetch current user gender to show opposite gender by default
        const userRes = await pool.request().input('userId', sql.Int, userId).query('SELECT gender FROM dbo.Users WHERE Id = @userId');
        const userGender = userRes.recordset[0]?.gender;
        const targetGender = userGender === 'Male' ? 'Female' : 'Male';

        const { ageMin, ageMax, religion, religions, states, castes, professions, fatherProfessions, statuses, search, online, photo, isPremium, isNew: isNewFilter } = req.query;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const offset = (page - 1) * pageSize;

        if (process.env.NODE_ENV === 'development') {
            console.log('Browse Profiles Request:', { userId, page, pageSize, offset, ageMin, ageMax, religions, states, castes, professions, fatherProfessions, statuses });
        }

        let where = `WHERE Id != @userId AND IsApproved = 1 AND gender = @targetGender`;

        const request = pool.request()
            .input('userId', sql.Int, userId)
            .input('targetGender', sql.NVarChar, targetGender);

        if (ageMin) {
            where += ` AND DATEDIFF(YEAR, dob, SYSUTCDATETIME()) >= @ageMin`;
            request.input('ageMin', sql.Int, parseInt(ageMin));
        }
        if (ageMax) {
            where += ` AND DATEDIFF(YEAR, dob, SYSUTCDATETIME()) <= @ageMax`;
            request.input('ageMax', sql.Int, parseInt(ageMax));
        }

        if (religions) {
            const relList = religions.split(',').map(r => r.trim()).filter(Boolean);
            if (relList.length > 0) {
                where += ` AND religion IN (${relList.map((_, i) => `@rel${i}`).join(',')})`;
                relList.forEach((r, i) => request.input(`rel${i}`, sql.NVarChar, r));
            }
        } else if (religion && religion !== 'any') {
            where += ` AND religion = @religion`;
            request.input('religion', sql.NVarChar, religion);
        }

        if (states) {
            const stateList = states.split(',').map(s => s.trim()).filter(Boolean);
            if (stateList.length > 0) {
                where += ` AND state IN (${stateList.map((_, i) => `@state${i}`).join(',')})`;
                stateList.forEach((s, i) => request.input(`state${i}`, sql.NVarChar, s));
            }
        }

        if (castes) {
            const casteList = castes.split(',').map(c => c.trim()).filter(Boolean);
            if (casteList.length > 0) {
                where += ` AND caste IN (${casteList.map((_, i) => `@caste${i}`).join(',')})`;
                casteList.forEach((c, i) => request.input(`caste${i}`, sql.NVarChar, c));
            }
        }

        if (professions) {
            const profList = professions.split(',').map(p => p.trim()).filter(Boolean);
            if (profList.length > 0) {
                where += ` AND PersonProfession IN (${profList.map((_, i) => `@prof${i}`).join(',')})`;
                profList.forEach((p, i) => request.input(`prof${i}`, sql.NVarChar, p));
            }
        }

        if (fatherProfessions) {
            const fprofList = fatherProfessions.split(',').map(p => p.trim()).filter(Boolean);
            if (fprofList.length > 0) {
                where += ` AND FatherProfession IN (${fprofList.map((_, i) => `@fprof${i}`).join(',')})`;
                fprofList.forEach((fp, i) => request.input(`fprof${i}`, sql.NVarChar, fp));
            }
        }

        if (statuses) {
            const statusList = statuses.split(',');
            const conditions = [];
            if (statusList.includes('Active')) conditions.push("(Status = 'Active' OR (Status IS NULL AND IsApproved = 1))");
            if (statusList.includes('Expired')) conditions.push("Status = 'Expired'");
            if (conditions.length > 0) {
                where += ` AND (${conditions.join(' OR ')})`;
            }
        }

        // Quick Filters
        if (online === 'true') {
            // Placeholder: currently no online status field, could be based on LastLogin
            // where += ` AND LastLoginAt > DATEADD(minute, -15, GETUTCDATETIME())`;
        }
        if (photo === 'true') {
            where += ` AND photo IS NOT NULL AND photo != ''`;
        }
        if (isPremium === 'true') {
            // Placeholder: assuming a column exists or using a logic
            // where += ` AND IsPremium = 1`;
        }
        if (isNewFilter === 'true') {
            where += ` AND CreatedAt > DATEADD(day, -7, SYSUTCDATETIME())`;
        }

        if (search) {
            where += ` AND (username LIKE '%' + @search + '%' OR district LIKE '%' + @search + '%' OR PersonProfession LIKE '%' + @search + '%' OR state LIKE '%' + @search + '%')`;
            request.input('search', sql.NVarChar, search);
        }

        // Final query construction
        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        const sqlQuery = `
            SELECT Id, username, dob, PersonProfession, FatherProfession, district, state, religion, caste, photo, IsApproved, CreatedAt, Status,
                   (CASE WHEN CreatedAt > DATEADD(day, -7, SYSUTCDATETIME()) THEN 1 ELSE 0 END) as isNew
            FROM dbo.Users 
            ${where}
            ORDER BY CreatedAt DESC
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `;

        const result = await request.query(sqlQuery);

        const formatted = result.recordset.map(r => ({
            id: r.Id,
            name: r.username,
            age: r.dob ? new Date().getFullYear() - new Date(r.dob).getFullYear() : 'N/A',
            profession: r.PersonProfession || 'Not specified',
            city: r.district || 'N/A',
            state: r.state || 'N/A',
            religion: r.religion,
            caste: r.caste,
            matchScore: 85,
            image: r.photo ? (r.photo.startsWith('http') ? r.photo : `/uploads/${r.photo.split(/[/\\]/).pop()}`) : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
            isNew: r.isNew === 1,
            isPremium: false // Placeholder
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Browse error details:', {
            message: err.message,
            stack: err.stack,
            query: err.query
        });
        res.status(500).json({ message: 'Server Error', details: err.message });
    }
});

module.exports = router;
