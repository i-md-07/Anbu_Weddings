# High-Fidelity Homepage Design

This is a code bundle for High-Fidelity Homepage Design. The original project is available at https://www.figma.com/design/KYzhNUTsqHS4jek7z0wPNC/High-Fidelity-Homepage-Design.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

Server-side notes:

- The backend uses MSSQL and stored procedures (see `server/sql/create_users_table.sql`).
- `UserType` is supported (0 = user, 1 = admin). After you create an account you can promote a user to admin via SQL (`UPDATE dbo.Users SET UserType = 1 WHERE email = 'you@example.com'`) or use the `server/scripts/test-admin-users.js` script which registers and promotes a user for testing.
- On login the server returns `{ token, user }` where `user.userType` and `user.isAdmin` indicate role; the frontend navigates to `/admin` when `userType === 1`.
