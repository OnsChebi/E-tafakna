import { Request, Response } from "express";
import { createExpert, findExpertByEmail } from "../services/expert.service";
import { comparePassword, generateToken } from "../utils/auth";

export const registerExpert = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const expert = await createExpert(name, email, password);
    res.status(201).json({ expert });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const loginExpert =async(req:Request,res:Response)=>
{
    const {email,password}=req.body;
    const expert = await findExpertByEmail(email);
    if (!expert || (await comparePassword(password, expert.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
}
const token =  generateToken(expert.id);
res.json({ token });
}
