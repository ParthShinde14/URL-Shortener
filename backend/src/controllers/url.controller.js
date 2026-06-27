const { nanoid } = require("nanoid");
const { pool } = require("../config/db");
const { redis } = require("../config/redis");

// POST /api/shorten
const shortenUrl = async (req, res) => {
  const { longUrl, expiresIn } = req.body;

  // Validate URL
  try {
    new URL(longUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const shortCode = nanoid(6);
  const expiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
    : null;

  await pool.execute(
    "INSERT INTO urls (short_code, long_url, expires_at) VALUES (?, ?, ?)",
    [shortCode, longUrl, expiresAt]
  );

  // Cache it
  try {
    await redis.setEx(`url:${shortCode}`, 3600, longUrl);
  } catch {}

  const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
  res.status(201).json({ shortUrl, shortCode, longUrl, expiresAt });
};

// GET /:code — redirect
const redirectUrl = async (req, res) => {
  const { code } = req.params;

  // Check cache first
  try {
    const cached = await redis.get(`url:${code}`);
    if (cached) {
      await pool.execute("UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?", [code]);
      await pool.execute("INSERT INTO clicks (short_code) VALUES (?)", [code]);
      return res.redirect(cached);
    }
  } catch {}

  // Fall back to DB
  const [rows] = await pool.execute(
    "SELECT long_url, expires_at FROM urls WHERE short_code = ?",
    [code]
  );

  if (!rows.length) return res.status(404).json({ error: "Link not found" });

  const { long_url, expires_at } = rows[0];

  if (expires_at && new Date() > new Date(expires_at)) {
    return res.status(410).json({ error: "This link has expired" });
  }

  // Update clicks + cache
  await pool.execute("UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?", [code]);
  await pool.execute("INSERT INTO clicks (short_code) VALUES (?)", [code]);

  try {
    await redis.setEx(`url:${code}`, 3600, long_url);
  } catch {}

  res.redirect(long_url);
};

// GET /api/links — list all links
const getAllLinks = async (req, res) => {
  const [rows] = await pool.execute(
    "SELECT short_code, long_url, clicks, expires_at, created_at FROM urls ORDER BY created_at DESC LIMIT 50"
  );
  res.json(rows);
};

// DELETE /api/links/:code
const deleteLink = async (req, res) => {
  const { code } = req.params;
  await pool.execute("DELETE FROM urls WHERE short_code = ?", [code]);
  await pool.execute("DELETE FROM clicks WHERE short_code = ?", [code]);
  try { await redis.del(`url:${code}`); } catch {}
  res.json({ message: "Deleted" });
};

// GET /api/stats/:code
const getStats = async (req, res) => {
  const { code } = req.params;
  const [rows] = await pool.execute(
    "SELECT short_code, long_url, clicks, expires_at, created_at FROM urls WHERE short_code = ?",
    [code]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const [clickRows] = await pool.execute(
    "SELECT DATE(clicked_at) as date, COUNT(*) as count FROM clicks WHERE short_code = ? GROUP BY DATE(clicked_at) ORDER BY date DESC LIMIT 7",
    [code]
  );

  res.json({ ...rows[0], clicksByDay: clickRows });
};

module.exports = { shortenUrl, redirectUrl, getAllLinks, deleteLink, getStats };
