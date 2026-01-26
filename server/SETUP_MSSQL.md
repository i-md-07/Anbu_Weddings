# Migrating server from MongoDB to MSSQL (Stored Procedures)

This guide covers the steps to switch the backend from MongoDB to Microsoft SQL Server using stored procedures.

> Note: After migration, the server uses `mssql` package and stored procedures: `sp_register_user`, `sp_get_user_by_email`, `sp_get_user_by_id`.

## 1) Create the `Matrimony` database and run the setup script

Open PowerShell or SQL Server Management Studio (SSMS) and run the script at `server/sql/mssql_setup.sql` or run the new, focused `server/sql/create_users_table.sql` file to create only the `Users` table and registration SP.

PowerShell + sqlcmd example (Windows):

```powershell
# Create database if not exists and run the setup script
sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -Q "IF DB_ID('Matrimony') IS NULL CREATE DATABASE Matrimony;"

# Run the setup SQL file against the Matrimony database
sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -d Matrimony -i server/sql/mssql_setup.sql
```

Or run the `server/sql/mssql_setup.sql` file in SSMS or Azure Data Studio (choose the `Matrimony` DB first).

## 2) Update server environment variables

Edit `server/.env` (or your environment) with MSSQL credentials and remove or comment out `MONGO_URI`:

````env
# OPTIONAL: existing MONGO_URI (keep for reference or comment out)
# MONGO_URI=mongodb+srv://...

PORT=5000
JWT_SECRET=your_jwt_secret_key_here

You can set connection values using either:

- individual `DB_SERVER`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, etc. (this is the default), or
- a single `DB_CONNECTION_STRING` which will be preferred if present.

Example 1 — using individual settings:

```env
# OPTIONAL: existing MONGO_URI (keep for reference or comment out)
# MONGO_URI=mongodb+srv://...

PORT=5000
JWT_SECRET=your_jwt_secret_key_here

DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=Matrimony
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_ENCRYPT=false
DB_TRUST_SERVER_CERT=true
````

Example 2 — using a single connection string (preferred when provided):

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

DB_CONNECTION_STRING=Server=localhost,1433;Database=Matrimony;User Id=sa;Password=YourStrong!Passw0rd;Encrypt=false;TrustServerCertificate=true;
```

### Windows Integrated Authentication (Trusted Connection)

If you are running the server locally on a Windows machine and want to use Windows Integrated authentication (no password storage), set `USE_WINDOWS_AUTH=true` and set `DB_SERVER` to your instance name (for example `MD\\SQLEXPRESS04`).

Example for Windows Auth (no connection string):

```env
USE_WINDOWS_AUTH=true
DB_SERVER=MD\\SQLEXPRESS04
DB_DATABASE=Matrimony
# DB_CONNECTION_STRING can be left commented out.
```

If you prefer a connection string for msnodesqlv8, use:

```env
# DB_CONNECTION_STRING=Driver={SQL Server Native Client 11.0};Server=MD\\SQLEXPRESS04;Database=Matrimony;Trusted_Connection=Yes;
```

Note: Windows Integrated Authentication with Node typically uses the `msnodesqlv8` npm package and the SQL Server Native Client, but this package is optional. If `msnodesqlv8` fails to build on your machine (native build tools or prebuilt binaries may be missing), use the `sqlcmd` steps shown below or switch to SQL auth (DB_USER/DB_PASSWORD) instead.

### Troubleshooting msnodesqlv8 installation

- If `npm install` fails for `msnodesqlv8`, it's usually because native build tools or matching prebuilt binaries are not available for your Node version.
- Remedies:
  - Install Visual Studio Build Tools ("Desktop development with C++" workload) so `node-gyp` can build the native addon, or
  - Use Node LTS (v18) which may have prebuilt binaries available for `msnodesqlv8`.

If you prefer not to build native modules, you can still run the SQL setup using `sqlcmd` (which uses Windows auth via `-E`) as shown below.

```powershell
# Create DB if not exists and run setup script with Windows Integrated Auth
sqlcmd -S "MD\\SQLEXPRESS04" -E -Q "IF DB_ID('Matrimony') IS NULL CREATE DATABASE Matrimony;"
sqlcmd -S "MD\\SQLEXPRESS04" -E -d Matrimony -i server/sql/mssql_setup.sql
```

After running the SQL script with `sqlcmd`, you can start the server (it will attempt to use msnodesqlv8 if available; if not, use SQL auth or install the driver).

````

> If using a managed Azure DB or a secured SQL Server, please follow your provider's best practice for encryption and certificate trust (set `DB_ENCRYPT` and `DB_TRUST_SERVER_CERT` accordingly).

## 3) Install server dependencies

Change to the server folder and install packages (this includes `mssql`):

```bash
cd server
npm install
````

You can also run the Node-based setup script to execute the SQL file (this requires `msnodesqlv8` for Windows Auth):

```bash
npm run setup-db
```

## 4) Start the server

In the `server` folder run:

```bash
npm run dev
```

You should see a log message like:

```
MSSQL pool ready
```

If you see MSSQL connection errors — verify credentials and run the SQL script again.

### DB Health & Troubleshooting

- Health endpoints: `/api/status` (basic) and `/api/status/db-details` (shows whether `sp_register_user` exists and its parameter count).

Example:

```bash
curl http://localhost:5000/api/status/db-details
```

If `sp_register_user` is missing or its `param_count` doesn't include `mobile`, run the create script to update the stored proc:

```powershell
sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -d Matrimony -i server/sql/create_users_table.sql
```

## 5) Test the endpoints

Register (multipart):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "username=Test User" \
  -F "mobile=+911234567890" \
  -F "email=test@example.com" \
  -F "password=123456" \
  -F "dob=1990-01-01"
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

Get profile (`/api/auth/me`) — send header `Authorization: Bearer <token>` returned by login.

### Testing Stored Procedures directly via sqlcmd or SSMS

Register with a hashed password (replace with actual bcrypt hash):

```sql
DECLARE @result TABLE (status INT, message NVARCHAR(400), id INT);
INSERT INTO @result
EXEC dbo.sp_register_user
  @username = 'Test User',
  @mobile = '+911234567890',
  @email = 'sp_test@example.com',
  @password = 'HASHED_PASSWORD_PLACEHOLDER',
  @dob = '1990-01-01';
SELECT * FROM @result;
```

Get a user by email:

```sql
EXEC dbo.sp_get_user_by_email @email = 'sp_test@example.com';
```

Get a user by id:

```sql
EXEC dbo.sp_get_user_by_id @id = 1;
```

Note: Do not store or compare plain-text passwords in SQL. The application must hash the password (bcrypt) on registration and compare the provided plain password to the stored hash on login.

### Node (mssql) usage examples

Register (Node):

```js
const { poolPromise, sql } = require("./db"); // or require('../db') from server/models
const bcrypt = require("bcryptjs");

async function registerUser(user) {
  const pool = await poolPromise;
  const request = pool.request();
  request.input("username", sql.NVarChar(255), user.username);
  request.input("email", sql.NVarChar(255), user.email);
  request.input("password", sql.NVarChar(255), user.hashedPassword);
  request.input("mobile", sql.NVarChar(50), user.mobile);
  // add other inputs as required
  const result = await request.execute("sp_register_user");
  const row = result.recordset && result.recordset[0];
  if (!row || row.status <= 0)
    throw new Error(row?.message || "Registration failed");
  return row.id;
}
```

Login (Node):

```js
const { poolPromise, sql } = require("./db");
const bcrypt = require("bcryptjs");

async function loginUser(email, plainPassword) {
  const pool = await poolPromise;
  const request = pool.request();
  request.input("email", sql.NVarChar(255), email);
  const result = await request.execute("sp_get_user_by_email");
  const user = result.recordset && result.recordset[0];
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  // user authenticated
  return user;
}
```

## 6) Troubleshooting

- Stored procedures missing? Re-run `server/sql/mssql_setup.sql`.
- `mssql` connection issues: check `server/.env` and ensure SQL Server allows TCP connections and that your firewall allows the port.
- Use SSMS or Azure Data Studio to validate the `Users` table and `sp_*` stored procedures are present.
- If `uploads` folder isn't present, create it in `server/` and ensure writable permissions.

## 7) Optional cleanup

- Remove `mongoose` from `server/package.json` and run `npm install` again once you are confident MSSQL is working.
- Optionally, delete or archive the original Mongoose-based `server/models/User.js` if you want only MSSQL logic.

## 8) Next steps / Advanced

- Add a migration script to create DB and SPs automatically for CI/CD.
- Add integration tests that call the endpoints and validate DB state.
- Add a `users` DAO layer or TypeScript typings for stricter type safety.

---

If you want, I can:

- Run the SQL script and test the endpoints if you provide a running MSSQL instance and credentials, or
- Add an automated migration script and a `server` script to run the SQL file on `npm run setup`.
