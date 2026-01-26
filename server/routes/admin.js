const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
const multer = require('multer');
const path = require('path');

// GET /api/admin/users/unique-values - get distinct values for filters
router.get('/users/unique-values', async (req, res) => {
  try {
    const pool = await poolPromise;
    const [states, religions, castes, pProfs, fProfs] = await Promise.all([
      pool.request().query('SELECT DISTINCT state FROM dbo.Users WHERE state IS NOT NULL AND state != \'\''),
      pool.request().query('SELECT DISTINCT religion FROM dbo.Users WHERE religion IS NOT NULL AND religion != \'\''),
      pool.request().query('SELECT DISTINCT caste FROM dbo.Users WHERE caste IS NOT NULL AND caste != \'\''),
      pool.request().query('SELECT DISTINCT PersonProfession FROM dbo.Users WHERE PersonProfession IS NOT NULL AND PersonProfession != \'\''),
      pool.request().query('SELECT DISTINCT FatherProfession FROM dbo.Users WHERE FatherProfession IS NOT NULL AND FatherProfession != \'\'')
    ]);

    res.json({
      states: states.recordset.map(r => r.state).sort(),
      religions: religions.recordset.map(r => r.religion).sort(),
      castes: castes.recordset.map(r => r.caste).sort(),
      personProfessions: pProfs.recordset.map(r => r.PersonProfession).sort(),
      fatherProfessions: fProfs.recordset.map(r => r.FatherProfession).sort()
    });
  } catch (err) {
    console.error('Unique values error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

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

// GET /api/admin/users - list basic user information (admin only)
router.get('/users', async (req, res) => {
  try {
    const pool = await poolPromise;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });

    // userType may be present in token; fallback to DB lookup if not
    const userTypeFromToken = decoded.userType;
    let userType = typeof userTypeFromToken === 'number' ? userTypeFromToken : null;

    if (userType === null) {
      // fetch from DB
      const result = await pool.request().input('id', require('mssql').Int, decoded.id).query('SELECT UserType FROM dbo.Users WHERE Id = @id');
      const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
      userType = row ? row.UserType : 0;
    }

    if (Number(userType) !== 1) return res.status(403).json({ message: 'Forbidden: admin only' });

    // Build filter query
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const request = pool.request();
    let where = '1=1';

    if (req.query.search) {
      where += " AND (username LIKE '%' + @search + '%' OR email LIKE '%' + @search + '%' OR mobile LIKE '%' + @search + '%' OR PersonProfession LIKE '%' + @search + '%' OR FatherProfession LIKE '%' + @search + '%')";
      request.input('search', require('mssql').NVarChar(255), req.query.search);
    }

    if (req.query.states) {
      const states = req.query.states.split(',');
      where += ` AND state IN (${states.map((_, i) => `@state${i}`).join(',')})`;
      states.forEach((s, i) => request.input(`state${i}`, require('mssql').NVarChar(100), s));
    }

    if (req.query.religions) {
      const religions = req.query.religions.split(',');
      where += ` AND religion IN (${religions.map((_, i) => `@rel${i}`).join(',')})`;
      religions.forEach((r, i) => request.input(`rel${i}`, require('mssql').NVarChar(100), r));
    }

    if (req.query.castes) {
      const castes = req.query.castes.split(',');
      where += ` AND caste IN (${castes.map((_, i) => `@caste${i}`).join(',')})`;
      castes.forEach((c, i) => request.input(`caste${i}`, require('mssql').NVarChar(100), c));
    }

    if (req.query.professions) {
      const profs = req.query.professions.split(',');
      where += ` AND PersonProfession IN (${profs.map((_, i) => `@prof${i}`).join(',')})`;
      profs.forEach((p, i) => request.input(`prof${i}`, require('mssql').NVarChar(100), p));
    }

    if (req.query.fatherProfessions) {
      const fprofs = req.query.fatherProfessions.split(',');
      where += ` AND FatherProfession IN (${fprofs.map((_, i) => `@fprof${i}`).join(',')})`;
      fprofs.forEach((p, i) => request.input(`fprof${i}`, require('mssql').NVarChar(100), p));
    }

    if (req.query.statuses) {
      const statuses = req.query.statuses.split(',');
      // Handle the virtual 'Pending' vs actual IsApproved
      const statusConditions = [];
      if (statuses.includes('Pending')) statusConditions.push('IsApproved = 0');
      if (statuses.includes('Active')) statusConditions.push("(Status = 'Active' OR (Status IS NULL AND IsApproved = 1))");
      if (statuses.includes('Expired')) statusConditions.push("Status = 'Expired'");

      if (statusConditions.length > 0) {
        where += ` AND (${statusConditions.join(' OR ')})`;
      }
    }

    if (req.query.pending === '1') {
      where += " AND IsApproved = 0 AND DATEDIFF(day, CreatedAt, SYSUTCDATETIME()) <= 7";
    }

    // Step 1: Get Total Count
    const countQuery = `SELECT COUNT(*) as total FROM dbo.Users WHERE ${where}`;
    const countRes = await request.query(countQuery);
    const totalCount = countRes.recordset[0].total;

    // Step 2: Get Paginated Data
    // We must reset or use a clone for inputs if we reuse request? 
    // mssql request object keeps inputs. So we can just add offset/fetch params.
    request.input('offset', require('mssql').Int, offset);
    request.input('pageSize', require('mssql').Int, pageSize);

    const sqlQuery = `
      SELECT Id, username, email, mobile, UserType, IsApproved, CreatedAt, state, district, religion, caste, subCaste, gender, FatherProfession, PersonProfession, Status, ExpiryDate 
      FROM dbo.Users 
      WHERE ${where} 
      ORDER BY CreatedAt DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;

    // Quick update for expired users before fetching
    await pool.request().query("UPDATE dbo.Users SET Status = 'Expired' WHERE Status = 'Active' AND ExpiryDate < SYSUTCDATETIME()");

    console.log('Executing User Query:', sqlQuery);
    const usersRes = await request.query(sqlQuery);
    console.log('Users returned:', usersRes.recordset.length, 'Total Count:', totalCount);

    res.json({
      users: usersRes.recordset,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    });

  } catch (err) {
    console.error('Admin route error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/admin/users - create user (admin only)
router.post('/users', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'jathagam', maxCount: 1 }]), async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    const userTypeFromToken = decoded.userType;
    let userType = typeof userTypeFromToken === 'number' ? userTypeFromToken : null;
    if (userType === null) {
      const pool = await poolPromise;
      const result = await pool.request().input('id', require('mssql').Int, decoded.id).query('SELECT UserType FROM dbo.Users WHERE Id = @id');
      const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
      userType = row ? row.UserType : 0;
    }
    if (Number(userType) !== 1) return res.status(403).json({ message: 'Forbidden: admin only' });

    // Accept same fields as signup
    const fields = ['username', 'email', 'mobile', 'password', 'dob', 'gender', 'fatherName', 'motherName', 'familyAnnualIncome', 'personAnnualIncome', 'state', 'district', 'address', 'religion', 'caste', 'subCaste', 'gothram', 'isApproved', 'userType', 'fatherProfession', 'personProfession'];
    const payload = {};
    for (const f of fields) payload[f] = req.body[f];

    if (!payload.username || !payload.password) return res.status(400).json({ message: 'username and password are required' });

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(payload.password, 10);
    payload.password = hashed;
    payload.isApproved = payload.isApproved === true || payload.isApproved === '1' || payload.isApproved === 1 ? true : false;
    payload.userType = typeof payload.userType !== 'undefined' ? Number(payload.userType) : 0;

    // Get file paths
    const photoPath = (req.files && req.files['photo']) ? req.files['photo'][0].path.replace(/\\/g, '/') : null;
    const jathagamPath = (req.files && req.files['jathagam']) ? req.files['jathagam'][0].path.replace(/\\/g, '/') : null;

    // Use createUser model function
    const User = require('../models/User');
    const newId = await User.createUser({
      username: payload.username,
      email: payload.email,
      mobile: payload.mobile,
      password: payload.password,
      dob: payload.dob,
      gender: payload.gender,
      fatherName: payload.fatherName,
      motherName: payload.motherName,
      familyAnnualIncome: payload.familyAnnualIncome,
      personAnnualIncome: payload.personAnnualIncome,
      state: payload.state,
      district: payload.district,
      address: payload.address,
      religion: payload.religion,
      caste: payload.caste,
      subCaste: payload.subCaste,
      gothram: payload.gothram,
      fatherProfession: payload.fatherProfession,
      personProfession: payload.personProfession,
      isApproved: payload.isApproved,
      userType: payload.userType,
      photo: photoPath,
      jathagam: jathagamPath,
      status: payload.isApproved ? 'Active' : 'Pending'
    });

    res.status(201).json({ userId: newId });
  } catch (err) {
    console.error('Admin create user error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/admin/users/:id - get full user (admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    const userTypeFromToken = decoded.userType;
    let userType = typeof userTypeFromToken === 'number' ? userTypeFromToken : null;
    if (userType === null) {
      const pool = await poolPromise;
      const result = await pool.request().input('id', require('mssql').Int, decoded.id).query('SELECT UserType FROM dbo.Users WHERE Id = @id');
      const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
      userType = row ? row.UserType : 0;
    }
    if (Number(userType) !== 1) return res.status(403).json({ message: 'Forbidden: admin only' });

    const uid = parseInt(req.params.id, 10);
    const pool = await poolPromise;
    const result = await pool.request().input('id', require('mssql').Int, uid).query('SELECT * FROM dbo.Users WHERE Id = @id');
    const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
    if (!row) return res.status(404).json({ message: 'User not found' });
    res.json({ user: row });
  } catch (err) {
    console.error('Admin get user error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/admin/users/:id - update user (admin only)
router.put('/users/:id', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'jathagam', maxCount: 1 }]), async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    const userTypeFromToken = decoded.userType;
    let userType = typeof userTypeFromToken === 'number' ? userTypeFromToken : null;
    if (userType === null) {
      const pool = await poolPromise;
      const result = await pool.request().input('id', require('mssql').Int, decoded.id).query('SELECT UserType FROM dbo.Users WHERE Id = @id');
      const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
      userType = row ? row.UserType : 0;
    }
    if (Number(userType) !== 1) return res.status(403).json({ message: 'Forbidden: admin only' });

    const uid = parseInt(req.params.id, 10);
    const {
      username, email, mobile, password, userType: newUserType,
      dob, gender, fatherName, motherName, familyAnnualIncome, personAnnualIncome, state, district, address, religion, caste, subCaste, gothram, isApproved,
      fatherProfession, personProfession
    } = req.body;

    const pool = await poolPromise;
    const reqQ = pool.request().input('id', require('mssql').Int, uid);

    const updates = [];
    if (username) { updates.push("username = @username"); reqQ.input('username', require('mssql').NVarChar(255), username); }
    if (email) { updates.push("email = @email"); reqQ.input('email', require('mssql').NVarChar(255), email); }
    if (mobile) { updates.push("mobile = @mobile"); reqQ.input('mobile', require('mssql').NVarChar(50), mobile); }
    if (dob) { updates.push("dob = @dob"); reqQ.input('dob', require('mssql').Date, dob); }
    if (gender) { updates.push("gender = @gender"); reqQ.input('gender', require('mssql').NVarChar(50), gender); }
    if (fatherName) { updates.push("fatherName = @fatherName"); reqQ.input('fatherName', require('mssql').NVarChar(255), fatherName); }
    if (motherName) { updates.push("motherName = @motherName"); reqQ.input('motherName', require('mssql').NVarChar(255), motherName); }
    if (familyAnnualIncome) { updates.push("familyAnnualIncome = @familyAnnualIncome"); reqQ.input('familyAnnualIncome', require('mssql').NVarChar(100), familyAnnualIncome); }
    if (personAnnualIncome) { updates.push("personAnnualIncome = @personAnnualIncome"); reqQ.input('personAnnualIncome', require('mssql').NVarChar(100), personAnnualIncome); }
    if (state) { updates.push("state = @state"); reqQ.input('state', require('mssql').NVarChar(100), state); }
    if (district) { updates.push("district = @district"); reqQ.input('district', require('mssql').NVarChar(100), district); }
    if (address) { updates.push("address = @address"); reqQ.input('address', require('mssql').NVarChar(500), address); }
    if (religion) { updates.push("religion = @religion"); reqQ.input('religion', require('mssql').NVarChar(100), religion); }
    if (caste) { updates.push("caste = @caste"); reqQ.input('caste', require('mssql').NVarChar(100), caste); }
    if (subCaste) { updates.push("subCaste = @subCaste"); reqQ.input('subCaste', require('mssql').NVarChar(100), subCaste); }
    if (gothram) { updates.push("gothram = @gothram"); reqQ.input('gothram', require('mssql').NVarChar(100), gothram); }
    if (fatherProfession) { updates.push("FatherProfession = @fatherProfession"); reqQ.input('fatherProfession', require('mssql').NVarChar(100), fatherProfession); }
    if (personProfession) { updates.push("PersonProfession = @personProfession"); reqQ.input('personProfession', require('mssql').NVarChar(100), personProfession); }
    if (typeof isApproved !== 'undefined') { updates.push("IsApproved = @isApproved"); reqQ.input('isApproved', require('mssql').Bit, (isApproved === true || isApproved === 'true' || isApproved === '1' || isApproved === 1) ? 1 : 0); }
    if (typeof newUserType !== 'undefined') { updates.push("UserType = @newUserType"); reqQ.input('newUserType', require('mssql').Int, newUserType); }
    if (password) {
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);
      updates.push("password = @password"); reqQ.input('password', require('mssql').NVarChar(255), hashed);
    }

    // Handle files
    if (req.files) {
      if (req.files['photo']) {
        const photoPath = req.files['photo'][0].path.replace(/\\/g, '/');
        updates.push("photo = @photo");
        reqQ.input('photo', require('mssql').NVarChar(500), photoPath);
      }
      if (req.files['jathagam']) {
        const jathagamPath = req.files['jathagam'][0].path.replace(/\\/g, '/');
        updates.push("jathagam = @jathagam");
        reqQ.input('jathagam', require('mssql').NVarChar(500), jathagamPath);
      }
    }

    if (updates.length === 0) return res.status(400).json({ message: 'No fields to update' });

    const updateSql = `UPDATE dbo.Users SET ${updates.join(', ')} , UpdatedAt = SYSUTCDATETIME() WHERE Id = @id`;
    await reqQ.query(updateSql);

    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /api/admin/users/:id/approve - mark user approved
router.patch('/users/:id/approve', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    const userTypeFromToken = decoded.userType;
    let userType = typeof userTypeFromToken === 'number' ? userTypeFromToken : null;
    if (userType === null) {
      const pool = await poolPromise;
      const result = await pool.request().input('id', require('mssql').Int, decoded.id).query('SELECT UserType FROM dbo.Users WHERE Id = @id');
      const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
      userType = row ? row.UserType : 0;
    }
    if (Number(userType) !== 1) return res.status(403).json({ message: 'Forbidden: admin only' });

    const uid = parseInt(req.params.id, 10);
    const pool2 = await poolPromise;
    await pool2.request().input('id', require('mssql').Int, uid).query("UPDATE dbo.Users SET IsApproved = 1, Status = 'Active', UpdatedAt = SYSUTCDATETIME() WHERE Id = @id");
    res.json({ message: 'Approved' });
  } catch (err) {
    console.error('Admin approve user error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Helper to ensure admin
async function ensureAdmin(req, res) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) { res.status(401).json({ message: 'No token, authorization denied' }); return null; }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) { res.status(401).json({ message: 'Invalid token' }); return null; }
    const userTypeFromToken = decoded.userType;
    let userType = typeof userTypeFromToken === 'number' ? userTypeFromToken : null;
    if (userType === null) {
      const pool = await poolPromise;
      const result = await pool.request().input('id', require('mssql').Int, decoded.id).query('SELECT UserType FROM dbo.Users WHERE Id = @id');
      const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;
      userType = row ? row.UserType : 0;
    }
    if (Number(userType) !== 1) { res.status(403).json({ message: 'Forbidden: admin only' }); return null; }
    return decoded;
  } catch (err) {
    console.error('ensureAdmin error', err);
    res.status(500).json({ message: 'Server Error' });
    return null;
  }
}

// =========================
// Masters: Religions
// =========================

// GET ALL RELIGIONS
router.get('/masters/religions', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const pool = await poolPromise;
    const result = await pool
      .request()
      .execute('sp_Masters_Religions_GetAll');

    res.json({ religions: result.recordset });
  } catch (err) {
    console.error('Get religions error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// CREATE RELIGION
router.post('/masters/religions', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name required' });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Name', require('mssql').NVarChar(255), name)
      .execute('sp_Masters_Religions_Create');

    res.status(201).json({ id: result.recordset[0].Id });
  } catch (err) {
    console.error('Create religion error', err);

    if (err.message.includes('already exists')) {
      return res.status(400).json({ message: 'Already exists' });
    }

    res.status(500).json({ message: 'Server Error' });
  }
});


// UPDATE RELIGION
router.put('/masters/religions/:id', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name required' });
    }

    const pool = await poolPromise;
    await pool
      .request()
      .input('Id', require('mssql').Int, id)
      .input('Name', require('mssql').NVarChar(255), name)
      .execute('sp_Masters_Religions_Update');

    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Update religion error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// DELETE RELIGION (CASCADE)
router.delete('/masters/religions/:id', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const id = parseInt(req.params.id, 10);

    const pool = await poolPromise;
    await pool
      .request()
      .input('ReligionId', require('mssql').Int, id)
      .execute('sp_Masters_Religions_Delete');

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete religion error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// =========================
// CASTES
// =========================

// GET CASTES BY RELIGION
router.get('/masters/religions/:id/castes', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const religionId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ReligionId', require('mssql').Int, religionId)
      .query(`
        SELECT Id, Name, CreatedAt, UpdatedAt
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


// CREATE CASTE
router.post('/masters/religions/:id/castes', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const religionId = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const pool = await poolPromise;

    // check duplicate
    const exists = await pool.request()
      .input('ReligionId', require('mssql').Int, religionId)
      .input('Name', require('mssql').NVarChar(255), name)
      .query(`
        SELECT Id
        FROM dbo.Masters_Castes
        WHERE ReligionId = @ReligionId AND Name = @Name
      `);

    if (exists.recordset.length)
      return res.status(400).json({ message: 'Already exists' });

    const insert = await pool.request()
      .input('ReligionId', require('mssql').Int, religionId)
      .input('Name', require('mssql').NVarChar(255), name)
      .query(`
        INSERT INTO dbo.Masters_Castes (ReligionId, Name)
        VALUES (@ReligionId, @Name);
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
      `);

    res.status(201).json({ id: insert.recordset[0].Id });
  } catch (err) {
    console.error('Create caste error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// UPDATE CASTE
router.put('/masters/castes/:id', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const casteId = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const pool = await poolPromise;

    await pool.request()
      .input('Id', require('mssql').Int, casteId)
      .input('Name', require('mssql').NVarChar(255), name)
      .query(`
        UPDATE dbo.Masters_Castes
        SET Name = @Name,
            UpdatedAt = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Update caste error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// DELETE CASTE (WITH SUBCASTES)
router.delete('/masters/castes/:id', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const casteId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    await pool.request()
      .input('CasteId', require('mssql').Int, casteId)
      .query(`
        DELETE FROM dbo.Masters_SubCastes WHERE CasteId = @CasteId;
        DELETE FROM dbo.Masters_Castes WHERE Id = @CasteId;
      `);

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete caste error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// GET ALL CASTES (NO RELIGION FILTER)
router.get('/masters/castes', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT c.Id, c.Name, c.ReligionId, r.Name AS ReligionName
      FROM dbo.Masters_Castes c
      JOIN dbo.Masters_Religions r ON r.Id = c.ReligionId
      ORDER BY r.Name, c.Name
    `);

    res.json({ castes: result.recordset });
  } catch (err) {
    console.error('Get all castes error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});



// =========================
// SUBCASTES
// =========================

// GET SUBCASTES BY CASTE
router.get('/masters/castes/:id/subcastes', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const casteId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    const result = await pool.request()
      .input('CasteId', require('mssql').Int, casteId)
      .query(`
        SELECT Id, Name, CreatedAt, UpdatedAt
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


// CREATE SUBCASTE
router.post('/masters/castes/:id/subcastes', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const casteId = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const pool = await poolPromise;

    const exists = await pool.request()
      .input('CasteId', require('mssql').Int, casteId)
      .input('Name', require('mssql').NVarChar(255), name)
      .query(`
        SELECT Id
        FROM dbo.Masters_SubCastes
        WHERE CasteId = @CasteId AND Name = @Name
      `);

    if (exists.recordset.length)
      return res.status(400).json({ message: 'Already exists' });

    const insert = await pool.request()
      .input('CasteId', require('mssql').Int, casteId)
      .input('Name', require('mssql').NVarChar(255), name)
      .query(`
        INSERT INTO dbo.Masters_SubCastes (CasteId, Name)
        VALUES (@CasteId, @Name);
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
      `);

    res.status(201).json({ id: insert.recordset[0].Id });
  } catch (err) {
    console.error('Create subcaste error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// UPDATE SUBCASTE
router.put('/masters/subcastes/:id', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const subCasteId = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    const pool = await poolPromise;

    await pool.request()
      .input('Id', require('mssql').Int, subCasteId)
      .input('Name', require('mssql').NVarChar(255), name)
      .query(`
        UPDATE dbo.Masters_SubCastes
        SET Name = @Name,
            UpdatedAt = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Update subcaste error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE SUBCASTE
router.delete('/masters/subcastes/:id', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const subCasteId = parseInt(req.params.id, 10);
    const pool = await poolPromise;

    await pool.request()
      .input('Id', require('mssql').Int, subCasteId)
      .query(`
        DELETE FROM dbo.Masters_SubCastes WHERE Id = @Id
      `);

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete subcaste error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/admin/users/:id/payments - get specific user's payments
router.get('/users/:id/payments', async (req, res) => {
  try {
    if (!await ensureAdmin(req, res)) return;

    const uid = parseInt(req.params.id, 10);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UserId', require('mssql').Int, uid)
      .query(`
        SELECT Id, Amount, PaymentDate, ExpiryDate, Status
        FROM dbo.Payments
        WHERE UserId = @UserId
        ORDER BY PaymentDate DESC
      `);

    res.json({ payments: result.recordset });
  } catch (err) {
    console.error('Get user individual payments error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// =========================
// User Payments
// =========================

router.get('/payments', async (req, res) => {
  try {
    console.log('GET /payments called with:', req.query);
    if (!await ensureAdmin(req, res)) {
      console.log('Admin check failed for /payments');
      return;
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const search = req.query.search || '';

    const pool = await poolPromise;
    const request = pool.request();

    let where = 'WHERE u.UserType = 0';
    if (search) {
      where += " AND (u.username LIKE '%' + @search + '%' OR u.mobile LIKE '%' + @search + '%')";
      request.input('search', require('mssql').NVarChar(255), search);
    }

    // Get Total Count
    const countQuery = `
      SELECT COUNT(DISTINCT u.Id) as total
      FROM dbo.Users u
      LEFT JOIN dbo.Payments p ON u.Id = p.UserId
      ${where}
    `;
    const countRes = await request.query(countQuery);
    const totalCount = countRes.recordset[0].total;
    console.log('Payments Total Count:', totalCount);

    // Get Paginated Data
    request.input('offset', require('mssql').Int, offset);
    request.input('pageSize', require('mssql').Int, pageSize);

    const sqlQuery = `
      SELECT 
        u.Id AS UserId, 
        u.username AS UserName, 
        u.mobile AS UserMobile,
        MAX(p.PaymentDate) AS LatestPaymentDate,
        MAX(p.ExpiryDate) AS ExpiryDate,
        SUM(p.Amount) AS TotalPaid,
        COUNT(p.Id) AS TransactionCount,
        u.Status AS UserStatus
      FROM dbo.Users u
      LEFT JOIN dbo.Payments p ON u.Id = p.UserId
      ${where}
      GROUP BY u.Id, u.username, u.mobile, u.Status
      ORDER BY LatestPaymentDate DESC, u.username ASC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;

    const result = await request.query(sqlQuery);
    console.log('Payments returned:', result.recordset.length);

    res.json({
      payments: result.recordset,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    });
  } catch (err) {
    console.error('Get user payments error', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
