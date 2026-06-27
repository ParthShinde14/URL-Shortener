require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./config/db");
// const { connectRedis } = require("./config/redis"); // Disable Redis
const urlRoutes = require("./routes/url.routes");
const { redirectUrl } = require("./controllers/url.controller");
const limiter = require("./middleware/rateLimit");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", limiter);

// API routes
app.use("/api", urlRoutes);

// Redirect route
app.get("/:code", redirectUrl);

// Health check
app.get("/", (req, res) =>
  res.json({ status: "ok", message: "URL Shortener API" })
);

const start = async () => {
  await initDB();
  // await connectRedis(); // Skip Redis
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
};

start();