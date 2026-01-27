const { poolPromise, sql } = require('../db');

async function recordView(viewerId, profileId) {
    if (viewerId === profileId) return; // Don't record self-views
    const pool = await poolPromise;
    await pool.request()
        .input('viewerId', sql.Int, viewerId)
        .input('profileId', sql.Int, profileId)
        .query(`
            INSERT INTO dbo.ProfileViews (ViewerId, ProfileId)
            VALUES (@viewerId, @profileId)
        `);
}

async function toggleShortlist(userId, profileId) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('profileId', sql.Int, profileId)
        .query(`
            IF EXISTS (SELECT 1 FROM dbo.Shortlists WHERE UserId = @userId AND ProfileId = @profileId)
            BEGIN
                DELETE FROM dbo.Shortlists WHERE UserId = @userId AND ProfileId = @profileId;
                SELECT 'Removed' as action;
            END
            ELSE
            BEGIN
                INSERT INTO dbo.Shortlists (UserId, ProfileId) VALUES (@userId, @profileId);
                SELECT 'Added' as action;
            END
        `);
    return result.recordset[0].action;
}

async function sendInterest(senderId, receiverId) {
    if (senderId === receiverId) throw new Error('Cannot send interest to yourself');
    const pool = await poolPromise;
    await pool.request()
        .input('senderId', sql.Int, senderId)
        .input('receiverId', sql.Int, receiverId)
        .query(`
            IF NOT EXISTS (SELECT 1 FROM dbo.Interests WHERE SenderId = @senderId AND ReceiverId = @receiverId)
            INSERT INTO dbo.Interests (SenderId, ReceiverId) VALUES (@senderId, @receiverId)
        `);
}

async function getDashboardStats(userId) {
    const pool = await poolPromise;
    const [views, myInterests, receivedInterests, unreadMessages] = await Promise.all([
        pool.request().input('userId', sql.Int, userId).query('SELECT COUNT(*) as count FROM dbo.ProfileViews WHERE ProfileId = @userId'),
        pool.request().input('userId', sql.Int, userId).query('SELECT COUNT(*) as count FROM dbo.Interests WHERE SenderId = @userId'),
        pool.request().input('userId', sql.Int, userId).query('SELECT COUNT(*) as count FROM dbo.Interests WHERE ReceiverId = @userId'),
        pool.request().input('userId', sql.Int, userId).query('SELECT COUNT(*) as count FROM dbo.Messages WHERE ReceiverId = @userId AND IsRead = 0')
    ]);

    return {
        profileViews: views.recordset[0].count,
        interestsSent: myInterests.recordset[0].count,
        interestsReceived: receivedInterests.recordset[0].count,
        messages: unreadMessages.recordset[0].count
    };
}

async function getShortlists(userId) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT u.Id, u.username, u.dob, u.PersonProfession, u.photo, u.district
            FROM dbo.Shortlists s
            JOIN dbo.Users u ON s.ProfileId = u.Id
            WHERE s.UserId = @userId
        `);
    return result.recordset;
}

async function getRecentActivity(userId) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT TOP 5 'view' as type, u.username as name, v.ViewedAt as time, u.photo as avatar
            FROM dbo.ProfileViews v
            JOIN dbo.Users u ON v.ViewerId = u.Id
            WHERE v.ProfileId = @userId
            UNION ALL
            SELECT TOP 5 'interest' as type, u.username as name, i.CreatedAt as time, u.photo as avatar
            FROM dbo.Interests i
            JOIN dbo.Users u ON i.SenderId = u.Id
            WHERE i.ReceiverId = @userId
            ORDER BY time DESC
        `);
    return result.recordset;
}

module.exports = {
    recordView,
    toggleShortlist,
    sendInterest,
    getDashboardStats,
    getShortlists,
    getRecentActivity
};
