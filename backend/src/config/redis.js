const { createClient } = require("redis");

const redis = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

redis.on("error", (err) => console.warn("Redis not available, skipping cache:", err.message));

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log("✅ Redis connected");
  } catch {
    console.warn("⚠️  Redis unavailable — app works without cache");
  }
};

module.exports = { redis, connectRedis };
