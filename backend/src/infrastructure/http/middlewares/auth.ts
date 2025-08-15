import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { verifyToken, generateAccessToken } from "../../../shared/utils/auth";

export interface JwtPayload {
  id: number;
  role?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT_SECRET or JWT_REFRESH_SECRET is not set in environment variables");
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return;
  }

  try {
    const decoded = verifyToken(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    } else if (error instanceof JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Internal server error during authentication" });
    }
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: No user in request" });
      return;
    }

    const userRole = req.user.role?.toLowerCase();
    const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole ?? "")) {
      res.status(403).json({ message: "Forbidden: Insufficient role" });
      return;
    }

    next();
  };
};

// Refresh token handler
export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
    const newAccessToken = generateAccessToken(decoded.id, decoded.role!);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
