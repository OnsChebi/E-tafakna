import express from "express";
import { AppDataSource } from "../database/db";
import { Expert } from "../entities/Expert.entity";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        // Get the expert repo
        const expertRepository = AppDataSource.getRepository(Expert);

        // Find the expert by email
        const expert = await expertRepository.findOne({ where: { email } });

        // Check if expert exists
        if (!expert) {
            res.status(404).json({ message: "Expert not found" });
            return; 
        }

        // Check if password is correct
        const isPasswordValid = await comparePassword(password, expert.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        // Generate token
        const token = generateToken(expert.id);

        // Send successful response
        res.json({
            message: "Login successful",
            token,
            expert: {
                id: expert.id,
                name: expert.name,
                email: expert.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/register", async (req,res)=>{
    const { name, email, password } = req.body;
    // Validate required fields
    if (!name || !email || !password) {
        res.status(400).json({ message: "Name, email, and password are required"
        });
        return;
        }
        try{
            const expertRepository = AppDataSource.getRepository(Expert);
            //check if email already exists
            const existingExpert = await expertRepository.findOne({ where: { email } });
            if (existingExpert) {
                res.status(400).json({ message: "Email already exists" });
                return;
        }
        // hash the password
        const hashedPassword = await hashPassword(password);
        // Create new expert
        const newExpert = expertRepository.create({
            name,
            email,
            password: hashedPassword
            });
            // Save new expert to database
            await expertRepository.save(newExpert);
            res.status(201).json({
                message: "Expert created successfully",
                expert: {
                    id: newExpert.id,
                    name: newExpert.name,
                    email: newExpert.email
                    }
            });
            } catch (error) {
                console.error("Registration error:", error);
                res.status(500).json({ message: "Internal server error" });
                }
})
export default router;