import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// JWT payload interface
interface JwtPayload {
  id: number;
  role?: string;
}

// Extend Express's Request object
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

// ✅ Don't use RequestHandler here
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ Role-based authorization middleware
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role ?? "")) {
      res.status(403).json({ message: "Forbidden: Insufficient role" });
      return;
    }

    next();
  };
};
