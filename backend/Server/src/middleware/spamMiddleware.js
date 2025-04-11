import { User } from "../models/user.model.js";
const DAILY_LIMIT = 5;
const BAN_DURATION_DAYS = 7;

export const requestLimiter = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = new Date();
    const info = user.requestInfo;

    // If banned
    if (info.bannedUntil && now < new Date(info.bannedUntil)) {
      return res.status(429).json({
        error: "Request limit exceeded. You are banned until " + new Date(info.bannedUntil).toLocaleString()
      });
    }

    // If new day, reset counter
    const lastReset = new Date(info.lastReset);
    if (
      now.getDate() !== lastReset.getDate() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      user.requestInfo.count = 1;
      user.requestInfo.lastReset = now;
      user.requestInfo.bannedUntil = null;
    } else {
      user.requestInfo.count += 1;

      if (user.requestInfo.count > DAILY_LIMIT) {
        const bannedUntil = new Date();
        bannedUntil.setDate(now.getDate() + BAN_DURATION_DAYS);
        user.requestInfo.bannedUntil = bannedUntil;

        await user.save();
        return res.status(429).json({
          message: `Too many requests. You are banned for ${BAN_DURATION_DAYS} days until ${bannedUntil.toLocaleString()}`
        });
      }
    }

    await user.save();
    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(500).json({ error: "Internal server error in rate limiter" });
  }
};