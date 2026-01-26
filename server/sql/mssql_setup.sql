/*
  MSSQL Setup Script - create table and stored procedures.
  Run this on your MSSQL server (e.g., Azure, SQL Server) using SSMS or sqlcmd.

  NOTE: This is a basic schema and SP set intended to replace the MongoDB user operations.
*/

-- Create Users table
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255) NOT NULL,
        mobile NVARCHAR(50) NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        dob DATE NULL,
        gender NVARCHAR(50) NULL,
        fatherName NVARCHAR(255) NULL,
        motherName NVARCHAR(255) NULL,
        familyAnnualIncome NVARCHAR(100) NULL,
        personAnnualIncome NVARCHAR(100) NULL,
        state NVARCHAR(100) NULL,
        district NVARCHAR(100) NULL,
        address NVARCHAR(500) NULL,
        religion NVARCHAR(100) NULL,
        caste NVARCHAR(100) NULL,
        subCaste NVARCHAR(100) NULL,
        gothram NVARCHAR(100) NULL,
        photo NVARCHAR(500) NULL,
        jathagam NVARCHAR(500) NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END

-- If the Users table exists but doesn't have a `mobile` column, add it
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
    AND COL_LENGTH('dbo.Users', 'mobile') IS NULL
BEGIN
    ALTER TABLE dbo.Users
    ADD mobile NVARCHAR(50) NULL;
END

-- Drop if exists then create stored procedure for registration
IF OBJECT_ID('dbo.sp_register_user', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_register_user;
GO

CREATE PROCEDURE dbo.sp_register_user
    @username NVARCHAR(255),
    @mobile NVARCHAR(50) = NULL,
    @email NVARCHAR(255),
    @password NVARCHAR(255),
    @dob DATE = NULL,
    @gender NVARCHAR(50) = NULL,
    @fatherName NVARCHAR(255) = NULL,
    @motherName NVARCHAR(255) = NULL,
    @familyAnnualIncome NVARCHAR(100) = NULL,
    @personAnnualIncome NVARCHAR(100) = NULL,
    @state NVARCHAR(100) = NULL,
    @district NVARCHAR(100) = NULL,
    @address NVARCHAR(500) = NULL,
    @religion NVARCHAR(100) = NULL,
    @caste NVARCHAR(100) = NULL,
    @subCaste NVARCHAR(100) = NULL,
    @gothram NVARCHAR(100) = NULL,
    @photo NVARCHAR(500) = NULL,
    @jathagam NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check if email already exists
        IF EXISTS (SELECT 1
    FROM dbo.Users
    WHERE email = @email)
        BEGIN
        SELECT -1 AS status, 'Email already exists' AS message, NULL AS id;
        RETURN;
    END

        INSERT INTO dbo.Users
        (
        username, mobile, email, password, dob, gender, fatherName, motherName, familyAnnualIncome, personAnnualIncome, state, district, address, religion, caste, subCaste, gothram, photo, jathagam
        )
    VALUES
        (
            @username, @mobile, @email, @password, @dob, @gender, @fatherName, @motherName, @familyAnnualIncome, @personAnnualIncome, @state, @district, @address, @religion, @caste, @subCaste, @gothram, @photo, @jathagam
        );

        DECLARE @newId INT = CONVERT(INT, SCOPE_IDENTITY());
        SELECT 1 AS status, 'OK' AS message, @newId AS id;
    END TRY
    BEGIN CATCH
        SELECT -9 AS status, ERROR_MESSAGE() AS message, NULL AS id;
    END CATCH
END
GO

IF OBJECT_ID('dbo.sp_get_user_by_email', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_get_user_by_email;
GO
CREATE PROCEDURE dbo.sp_get_user_by_email
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        Id,
        username,
        mobile,
        email,
        password,
        dob,
        gender,
        fatherName,
        motherName,
        familyAnnualIncome,
        personAnnualIncome,
        state,
        district,
        address,
        religion,
        caste,
        subCaste,
        gothram,
        photo,
        jathagam,
        CreatedAt,
        UpdatedAt
    FROM dbo.Users
    WHERE email = @email;
END
GO

-- Get user by Id
IF OBJECT_ID('dbo.sp_get_user_by_id', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_get_user_by_id;
GO
CREATE PROCEDURE dbo.sp_get_user_by_id
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        Id,
        username,
        mobile,
        email,
        dob,
        gender,
        fatherName,
        motherName,
        familyAnnualIncome,
        personAnnualIncome,
        state,
        district,
        address,
        religion,
        caste,
        subCaste,
        gothram,
        photo,
        jathagam,
        CreatedAt,
        UpdatedAt
    FROM dbo.Users
    WHERE Id = @id;
END
GO

/* Masters tables: Religions, Castes, SubCastes */

IF OBJECT_ID('dbo.Masters_Religions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Masters_Religions
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(255) NOT NULL UNIQUE,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END

IF OBJECT_ID('dbo.Masters_Castes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Masters_Castes
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ReligionId INT NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Castes_Religion FOREIGN KEY (ReligionId) REFERENCES dbo.Masters_Religions(Id)
    );
    CREATE UNIQUE INDEX IX_Masters_Castes_Religion_Name ON dbo.Masters_Castes (ReligionId, Name);
END

IF OBJECT_ID('dbo.Masters_SubCastes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Masters_SubCastes
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CasteId INT NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_SubCastes_Caste FOREIGN KEY (CasteId) REFERENCES dbo.Masters_Castes(Id)
    );
    CREATE UNIQUE INDEX IX_Masters_SubCastes_Caste_Name ON dbo.Masters_SubCastes (CasteId, Name);
END

-- Optional: cascade delete behavior: remove child castes/subcastes when parent deleted
-- You can add ON DELETE CASCADE if desired; here we will perform explicit deletes in API to avoid accidental cascade

