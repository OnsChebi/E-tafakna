import { Request, Response } from "express";
import { SyncCalendlyMeetingsUseCase } from "../../../core/use-cases/SyncCalendlyMeetings";
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
     return;
    }

    const expertId = extractExpertIdFromToken(token);
    const useCase = new SyncCalendlyMeetingsUseCase(
      new MeetingRepositoryImpl(),
      new CalendlyRepositoryImpl(),
      new ExpertRepositoryImpl(),
    );

    await useCase.execute(expertId);

    res.status(200).json({ message: "Meetings synced successfully" });
  } catch (error) {
    console.error("Failed to sync meetings", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
