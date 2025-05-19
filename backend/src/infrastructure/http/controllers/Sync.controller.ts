import { Request, Response } from "express";
import { SyncCalendlyMeetingsUseCase } from "../../../core/use-cases/SyncCalendlyMeetings";
import { CalendlyRepositoryImpl } from "../../database/repo/CalendlyRepositoryImp";
import { MeetingRepositoryImpl } from "../../database/repo/MeetingRepositoryImp";

export const syncCalendlyMeetings = async (req: Request, res: Response) => {
  try {
    const expertId = Number(req.params.expertId);
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const useCase = new SyncCalendlyMeetingsUseCase(
      new MeetingRepositoryImpl(),
      new CalendlyRepositoryImpl()
    );

    await useCase.execute(expertId);

    res.status(200).json({ message: "Meetings synced successfully" });
  } catch (error) {
    console.error("Failed to sync meetings", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
