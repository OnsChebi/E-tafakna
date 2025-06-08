//controller
import { Request, Response } from "express";
import { MeetingRepositoryImpl } from "../../database/repo/MeetingRepositoryImp";
import { CancelMeetingsUseCase } from "../../../core/use-cases/calendly/CancelMeetings";
import { CalendlyRepositoryImpl } from "../../database/repo/CalendlyRepositoryImp";
import { GetUpcomingMeetingsUseCase } from "../../../core/use-cases/calendly/GetUpcomingMeetings";
import { GetAllUpcomingMeetingsForAdminUseCase } from "../../../core/use-cases/GetAllUpcomingMeetingsForAdmin";

const meetingRepo = new MeetingRepositoryImpl();
const calendlyRepo = new CalendlyRepositoryImpl();

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}


export class MeetingController {
  static async cancelMeeting(req: Request, res: Response) {
    try {
      const { eventUri, reason} = req.body;
      if (!eventUri || !reason) {
         res.status(400).json({ error: "Event URI and reason are required" });
        return
      }
      const useCase = new CancelMeetingsUseCase(meetingRepo ,calendlyRepo);
      await useCase.execute((req as any).user.id, eventUri ,reason);
  
      res.status(200).json({ message: "Meeting canceled successfully" });
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
      const useCase = new GetUpcomingMeetingsUseCase(meetingRepo);
      await useCase.execute(expertId);
      const upcoming = await meetingRepo.findUpcomingMeetings(expertId);

      res.status(200).json(upcoming);
      } catch (error) {
      console.error("Sync and fetch upcoming meetings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async  getAllUpcomingMeetings(req: Request, res: Response) {
    const useCase = new GetAllUpcomingMeetingsForAdminUseCase(meetingRepo);
  
    try {
      const meetings = await useCase.execute();
      res.status(200).json(meetings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching upcoming meetings" });
    }
  };


}




