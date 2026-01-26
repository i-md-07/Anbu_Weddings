MSSQL Setup

This project was originally using MongoDB. The server now supports MSSQL with stored procedures.

1. Run the SQL script in `server/sql/mssql_setup.sql` against your SQL Server instance to create the `Users` table and stored procedures.

2. Update `server/.env` with either a single `DB_CONNECTION_STRING` or with your MSSQL connection details (`DB_SERVER`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT`).
   If you want to use Windows Integrated Authentication on a Windows machine, set `USE_WINDOWS_AUTH=true` and set `DB_SERVER` to your instance (for example `MD\\SQLEXPRESS04`). The `msnodesqlv8` driver is optional — if it fails to install due to native build issues, run the SQL script with `sqlcmd` (recommended) or use SQL auth (`DB_USER`/`DB_PASSWORD`) by setting `USE_WINDOWS_AUTH=false`.

3. Install server dependencies and start the server:

```bash
cd server
npm install
npm run dev
```

To run the SQL setup from Node (requires `msnodesqlv8` for Windows Auth):

```bash
npm run setup-db
```

Notes:

- Password hashing still happens in the server; stored procedures accept the hashed password.
- The stored procedures implemented are: `sp_register_user`, `sp_get_user_by_email`, `sp_get_user_by_id`.

Database migration notes:

- `UserType` column (INT, default 0) has been added to the `Users` table to support role-based behavior (0 = regular user, 1 = admin).
- `sp_register_user` now accepts `@UserType INT = 0` and will set the `UserType` when inserting.
- If you already have a database, re-run `server/sql/create_users_table.sql` (it's idempotent: it will add the `UserType` column if missing and replace the stored procedures).
- Admin-only API: `GET /api/admin/users` (requires Bearer token of an admin user) returns a list of users.

New masters tables and APIs

- The SQL script `server/sql/mssql_setup.sql` now includes idempotent creation of `Masters_Religions`, `Masters_Castes`, and `Masters_SubCastes` tables.
- Admin-only APIs are available to manage masters:
  - `GET /api/admin/masters/religions`
  - `POST /api/admin/masters/religions` (body: { name })
  - `PUT  /api/admin/masters/religions/:id`
  - `DELETE /api/admin/masters/religions/:id`
  - `GET /api/admin/masters/religions/:id/castes`
  - `POST /api/admin/masters/religions/:id/castes` (body: { name })
  - `PUT  /api/admin/masters/castes/:id`
  - `DELETE /api/admin/masters/castes/:id`
  - `GET /api/admin/masters/castes/:id/subcastes`
  - `POST /api/admin/masters/castes/:id/subcastes` (body: { name })
  - `PUT  /api/admin/masters/subcastes/:id`
  - `DELETE /api/admin/masters/subcastes/:id`

Automated tests

- A simple integration test script is included: `server/scripts/test-masters.js`
- Run it after starting your server and DB: `cd server && npm run test-masters`
