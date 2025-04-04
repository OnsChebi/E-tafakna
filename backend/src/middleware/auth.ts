import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate =(req: Request, res: Response, next: NextFunction)=> {
   //extract the token from the header
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
    //check if the token is valid
    if (!token) {
         res.status(401).json({ message: "Unauthorized" });
         return;
    }

    //verify the token
    //Verifies the token using the secret key stored in .env
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)as { id: number };
        (req as any).user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};