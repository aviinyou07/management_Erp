/**
 * Database setup script
 * Run: node src/database/setup.js
 */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function setup() {
  // Connect without a specific DB so we can CREATE it
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  console.log("⏳ Running database setup…");
  await conn.query(sql);
  console.log("✅ Database & tables created successfully.");
  console.log("📋 Seed data inserted (admin + employee + holidays).");
  await conn.end();
}

setup().catch((err) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
