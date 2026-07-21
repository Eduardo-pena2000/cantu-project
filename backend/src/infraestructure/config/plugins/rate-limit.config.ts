import rateLimit from "express-rate-limit";
import { AppError } from "../../../shared";

// Rate limiting profile for auth endpoints (e.g. login)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(AppError.forbidden("Demasiados intentos de inicio de sesión. Por favor intente de nuevo en 15 minutos."));
  },
});
