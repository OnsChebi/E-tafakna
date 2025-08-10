import { Request, Response } from "express";
import { SyncCalendlyMeetingsUseCase } from "../../../core/use-cases/calendly/SyncCalendlyMeetings";
import { CalendlyRepositoryImpl } from "../../database/repo/CalendlyRepositoryImp";
import { MeetingRepositoryImpl } from "../../database/repo/MeetingRepositoryImp";
import jwt from "jsonwebtoken";
import { ExpertRepositoryImpl } from "../../database/repo/ExpertRepositoryImpl";

function extractExpertIdFromToken(token: string): number {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  return decoded.id; 
}


export const syncCalendlyMeetings = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
       res.status(401).json({ message: "Unauthorized: No token" });
       return
    }

    const expertId = extractExpertIdFromToken(token);
    const useCase = new SyncCalendlyMeetingsUseCase(
      new MeetingRepositoryImpl(),
      new CalendlyRepositoryImpl(),
      new ExpertRepositoryImpl(),
    );

    const savedMeetings = await useCase.execute(expertId);

    res.status(200).json({ message: "Meetings synced successfully", savedMeetings });
  } catch (error: any) {
    console.error("Failed to sync meetings:", error);

    if (error.response) {
      console.error("API Response data:", error.response.data);
      console.error("API Response status:", error.response.status);
    }

    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
