-- Run this script in your SQL Server database

-- 1. Add columns to Users table
ALTER TABLE dbo.Users ADD FatherProfession NVARCHAR(100);
ALTER TABLE dbo.Users ADD PersonProfession NVARCHAR(100);
GO

-- 2. Update sp_register_user (Optional, but recommended if you want to use the primary path)
-- Note: The Node.js fallback will handle it if this SP isn't updated, but updating is better.
ALTER PROCEDURE [dbo].[sp_register_user]
    @username NVARCHAR(255),
    @mobile NVARCHAR(50),
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
    @jathagam NVARCHAR(500) = NULL,
    @IsApproved BIT = 0,
    @UserType INT = 0,
    @FatherProfession NVARCHAR(100) = NULL,
    @PersonProfession NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.Users WHERE email = @email)
    BEGIN
        SELECT -1 AS status, 'Email already exists' AS message, 0 AS id;
        RETURN;
    END

    INSERT INTO dbo.Users (
        username, mobile, email, password, dob, gender,
        fatherName, motherName, familyAnnualIncome, personAnnualIncome,
        state, district, address, religion, caste, subCaste, gothram,
        photo, jathagam, IsApproved, UserType, CreatedAt, UpdatedAt,
        FatherProfession, PersonProfession
    )
    VALUES (
        @username, @mobile, @email, @password, @dob, @gender,
        @fatherName, @motherName, @familyAnnualIncome, @personAnnualIncome,
        @state, @district, @address, @religion, @caste, @subCaste, @gothram,
        @photo, @jathagam, @IsApproved, @UserType, SYSUTCDATETIME(), SYSUTCDATETIME(),
        @FatherProfession, @PersonProfession
    );

    SELECT 1 AS status, 'Success' AS message, SCOPE_IDENTITY() AS id;
END
GO

-- 3. Payment System & User Status
-- Add Status and ExpiryDate to Users
ALTER TABLE dbo.Users ADD Status NVARCHAR(50) DEFAULT 'Pending';
ALTER TABLE dbo.Users ADD ExpiryDate DATETIME;
GO

-- Create Payments Table
CREATE TABLE dbo.Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(Id),
    Amount DECIMAL(18,2) NOT NULL,
    PaymentDate DATETIME DEFAULT SYSUTCDATETIME(),
    ExpiryDate DATETIME NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Success',
    CreatedAt DATETIME DEFAULT SYSUTCDATETIME()
);
GO

