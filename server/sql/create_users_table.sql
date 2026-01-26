/*
  Idempotent Users table creation script for registration fields.
  Run this against your `Matrimony` database (e.g., with sqlcmd or SSMS).

  Notes:
  - `email` is UNIQUE to prevent duplicate accounts.
  - `mobile` is optional. If you want one account per mobile number, uncomment the UNIQUE index.
  - Passwords must be hashed (bcrypt/argon2) in the application before calling the stored procedure.
*/

IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255) NOT NULL,
        mobile NVARCHAR(50) NULL,
        email NVARCHAR(255) NOT NULL,
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
        IsApproved BIT NOT NULL DEFAULT 0,
        UserType INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );

    -- Add unique constraint on email
    CREATE UNIQUE INDEX UX_Users_Email ON dbo.Users(email);

-- If you want mobile to be unique, uncomment below:
-- CREATE UNIQUE INDEX UX_Users_Mobile ON dbo.Users(mobile) WHERE mobile IS NOT NULL;
END
ELSE
BEGIN
    -- If table exists but mobile column missing, add it
    IF COL_LENGTH('dbo.Users', 'mobile') IS NULL
    BEGIN
        ALTER TABLE dbo.Users ADD mobile NVARCHAR(50) NULL;
    END
    -- If UserType column missing, add it (default 0)
    IF COL_LENGTH('dbo.Users', 'UserType') IS NULL
    BEGIN
        ALTER TABLE dbo.Users ADD UserType INT NOT NULL DEFAULT 0;
    END
    -- If IsApproved column missing, add it
    IF COL_LENGTH('dbo.Users', 'IsApproved') IS NULL
    BEGIN
        ALTER TABLE dbo.Users ADD IsApproved BIT NOT NULL DEFAULT 0;
    END
    -- Ensure email unique index exists
    IF NOT EXISTS (SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'UX_Users_Email')
    BEGIN
        CREATE UNIQUE INDEX UX_Users_Email ON dbo.Users(email);
    END
END

-- Optional: drop/create a simple registration stored proc (idempotent)
IF OBJECT_ID('dbo.sp_register_user', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_register_user;
GO

CREATE PROCEDURE dbo.sp_register_user
    @username NVARCHAR(255),
    @mobile NVARCHAR(50) = NULL,
    @password NVARCHAR(255),
    @email NVARCHAR(255) = NULL,
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
    @jathagam NVARCHAR(500) = NULL,
    @IsApproved BIT = 0,
    @UserType INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1
    FROM dbo.Users
    WHERE email = @email)
        BEGIN
        SELECT -1 AS status, 'Email already exists' AS message, NULL AS id;
        RETURN;
    END

        -- Optional: enforce mobile uniqueness (if provided)
        IF (@mobile IS NOT NULL AND EXISTS(SELECT 1
        FROM dbo.Users
        WHERE mobile = @mobile))
        BEGIN
        SELECT -1 AS status, 'Mobile number already registered' AS message, NULL AS id;
        RETURN;
    END

        INSERT INTO dbo.Users
        (username, mobile, email, password, dob, gender, fatherName, motherName, familyAnnualIncome, personAnnualIncome, state, district, address, religion, caste, subCaste, gothram, photo, jathagam, IsApproved, UserType)
    VALUES
        (@username, @mobile, @email, @password, @dob, @gender, @fatherName, @motherName, @familyAnnualIncome, @personAnnualIncome, @state, @district, @address, @religion, @caste, @subCaste, @gothram, @photo, @jathagam, @IsApproved, @UserType);

        DECLARE @newId INT = CONVERT(INT, SCOPE_IDENTITY());
        SELECT 1 AS status, 'OK' AS message, @newId AS id;
    END TRY
    BEGIN CATCH
        SELECT -9 AS status, ERROR_MESSAGE() AS message, NULL AS id;
    END CATCH
END
GO

-- Convenience selects
IF OBJECT_ID('dbo.sp_get_user_by_email', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_get_user_by_email;
GO
CREATE PROCEDURE dbo.sp_get_user_by_email
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT *
    FROM dbo.Users
    WHERE email = @email;
END
GO

IF OBJECT_ID('dbo.sp_get_user_by_id', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_get_user_by_id;
GO
CREATE PROCEDURE dbo.sp_get_user_by_id
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT *
    FROM dbo.Users
    WHERE Id = @id;
END
GO
