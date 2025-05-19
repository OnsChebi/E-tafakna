import { Request, Response } from "express";
import { MeetingRepositoryImpl } from "../../database/repo/MeetingRepositoryImp";
import { CancelMeetingsUseCase } from "../../../core/use-cases/CancelMeetings";
import { SyncCalendlyMeetingsUseCase } from "../../../core/use-cases/SyncCalendlyMeetings";
import { CalendlyRepositoryImpl } from "../../database/repo/CalendlyRepositoryImp";

const meetingRepo = new MeetingRepositoryImpl();
const calendlyRepo = new CalendlyRepositoryImpl();

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}


export class MeetingController {
  static async cancelMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.body;
      const useCase = new CancelMeetingsUseCase(meetingRepo);
      await useCase.execute(meetingId);
      res.status(200).json({ message: "Meeting canceled successfully" });
      return;
    } catch (error) {
      console.error("Cancel meeting error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async busyDays(req: Request, res: Response) {
    try {
      const expertId = (req as AuthenticatedRequest).user?.id;
      if (!expertId) {res.status(401).json({ message: "Unauthorized" });
      return;
    }
      const days = await meetingRepo.findBusyDays(expertId);
      res.json(days);
      
    } catch (error) {
      console.error("Busy days error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async clientList(req: Request, res: Response) {
    try {
      const expertId = (req as AuthenticatedRequest).user?.id;
      if (!expertId) {res.status(401).json({ message: "Unauthorized" });
      return;
    }
      const clients = await meetingRepo.findClientsForExpert(expertId);
      res.json(clients);
    } catch (error) {
      console.error("Client list error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async todaysMeetings(req: Request, res: Response) {
    try {
      const expertId = (req as AuthenticatedRequest).user?.id;
      if (!expertId) {res.status(401).json({ message: "Unauthorized" });
      return;
    }
      const meetings = await meetingRepo.findTodaysMeetings(expertId);
      res.json(meetings);
    } catch (error) {
      console.error("Today's meetings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async pastMeetings(req: Request, res: Response) {
    try {
      const expertId = (req as AuthenticatedRequest).user?.id;
      if (!expertId) {res.status(401).json({ message: "Unauthorized" });
      return;
    }
      const meetings = await meetingRepo.findPastMeetings(expertId);
      res.json(meetings);
    } catch (error) {
      console.error("Past meetings error:", error);
       res.status(500).json({ message: "Internal server error" });
    }
  }

  static async upcomingMeetings(req: Request, res: Response) {
    try {
      const expertId = (req as AuthenticatedRequest).user?.id;
      if (!expertId) {res.status(401).json({ message: "Unauthorized" });
      return;
    }
      const useCase = new SyncCalendlyMeetingsUseCase(meetingRepo, calendlyRepo);
      const meetings = await useCase.execute(expertId);
      res.json(meetings);
    } catch (error) {
      console.error("Sync and fetch upcoming meetings error:", error);
       res.status(500).json({ message: "Internal server error" });
    }
  }


}
