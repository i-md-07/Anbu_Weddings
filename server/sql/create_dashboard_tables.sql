/*
  SQL script for dynamic dashboard features.
  Run this on your MSSQL server.
*/

-- Create ProfileViews table
IF OBJECT_ID('dbo.ProfileViews', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProfileViews
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ViewerId INT NOT NULL,
        ProfileId INT NOT NULL,
        ViewedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_ProfileViews_Viewer FOREIGN KEY (ViewerId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_ProfileViews_Profile FOREIGN KEY (ProfileId) REFERENCES dbo.Users(Id)
    );
    CREATE INDEX IX_ProfileViews_ProfileId ON dbo.ProfileViews(ProfileId);
END

-- Create Interests table
IF OBJECT_ID('dbo.Interests', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Interests
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        SenderId INT NOT NULL,
        ReceiverId INT NOT NULL,
        Status NVARCHAR(50) DEFAULT 'Pending', -- Pending, Accepted, Declined
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Interests_Sender FOREIGN KEY (SenderId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_Interests_Receiver FOREIGN KEY (ReceiverId) REFERENCES dbo.Users(Id),
        CONSTRAINT UQ_Interests_Sender_Receiver UNIQUE (SenderId, ReceiverId)
    );
    CREATE INDEX IX_Interests_ReceiverId ON dbo.Interests(ReceiverId);
END

-- Create Shortlists table
IF OBJECT_ID('dbo.Shortlists', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Shortlists
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ProfileId INT NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Shortlists_User FOREIGN KEY (UserId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_Shortlists_Profile FOREIGN KEY (ProfileId) REFERENCES dbo.Users(Id),
        CONSTRAINT UQ_Shortlists_User_Profile UNIQUE (UserId, ProfileId)
    );
    CREATE INDEX IX_Shortlists_UserId ON dbo.Shortlists(UserId);
END

-- Create Messages table (Basic structure for counts)
IF OBJECT_ID('dbo.Messages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Messages
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        SenderId INT NOT NULL,
        ReceiverId INT NOT NULL,
        Content NVARCHAR(MAX) NULL,
        IsRead BIT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Messages_Sender FOREIGN KEY (SenderId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_Messages_Receiver FOREIGN KEY (ReceiverId) REFERENCES dbo.Users(Id)
    );
    CREATE INDEX IX_Messages_ReceiverId ON dbo.Messages(ReceiverId);
END
