import rateLimit from "express-rate-limit";

export const commentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // limit each IP to 100 requests per windowMs
  message: "Too many comments from this IP, please try again later",
});
