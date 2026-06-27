const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "urlshortener",
  waitForConnections: true,
  connectionLimit: 10,
});

const initDB = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS urls (
      id INT AUTO_INCREMENT PRIMARY KEY,
      short_code VARCHAR(10) UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      clicks INT DEFAULT 0,
      expires_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS clicks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      short_code VARCHAR(10) NOT NULL,
      clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database ready");
};

module.exports = { pool, initDB };
