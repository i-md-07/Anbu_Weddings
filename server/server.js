// ✅ LOAD ENV FIRST (THIS MUST BE LINE 1)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ✅ IMPORT DB AFTER dotenv
const { poolPromise } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists (multer will not create it automatically)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at ${uploadsDir}`);
}

// Database Connection: MSSQL
poolPromise
  .then(() => console.log("✅ MSSQL pool ready"))
  .catch((err) => {
    console.error("❌ MSSQL Connection Error:", err.message);
    console.log(
      "Please check MSSQL env: DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE"
    );
    process.exit(1);
  });

// Routes
const authRoute = require("./routes/auth");
const statusRoute = require("./routes/status");
const adminRoute = require("./routes/admin");
const mastersRoute = require("./routes/masters");
const paymentRoute = require("./routes/payment");
const userRoute = require("./routes/user");

app.use("/api/auth", authRoute);
app.use("/api/status", statusRoute);
app.use("/api/admin", adminRoute);
app.use("/api/masters", mastersRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("Matrimony API is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Global error handler (must be after routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const payload = { message: 'Internal Server Error' };
  if (process.env.NODE_ENV === 'development') {
    payload.error = err && err.message;
    payload.stack = err && err.stack;
  }
  res.status(500).json(payload);
});
