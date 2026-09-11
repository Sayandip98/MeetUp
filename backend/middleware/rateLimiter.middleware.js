import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 attempts per IP per 15 minutes
  message: {
    success: false,
    message: "Too many auth attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { apiLimiter, authLimiter };
