import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
   //extract the token from the header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    //check if the token is valid
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    //verify the token
    //Verifies the token using the secret key stored in .env
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};