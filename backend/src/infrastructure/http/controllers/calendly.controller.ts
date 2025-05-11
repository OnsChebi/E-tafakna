import { Request, Response } from "express";
import { CalendlyRepositoryImpl } from "../../database/repo/CalendlyRepositoryImp";
import { GetTodaysMeetingsUseCase } from "../../../core/use-cases/GetTodaysMeetings";
import { GetUpcomingMeetingsUseCase } from "../../../core/use-cases/GetUpcomingMeetings";
import { GetPastMeetingsUseCase } from "../../../core/use-cases/GetPastMeetings";
import { GetClientListUseCase } from "../../../core/use-cases/GetClientList";
import { GetBusyDays } from "../../../core/use-cases/GetBusyDays";

const calendlyRepo = new CalendlyRepositoryImpl();

export class CalendlyController {
  static async busyDays(req: Request, res: Response) {
    try {
      const useCase = new GetBusyDays(calendlyRepo);
      const busyDays = await useCase.execute((req as any).user.id);
      res.status(200).json({ busyDays });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async todaysMeetings(req: Request, res: Response) {
    try {
      const useCase = new GetTodaysMeetingsUseCase(calendlyRepo);
      const events = await useCase.execute((req as any).user.id);
      res.status(200).json({ events });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async upcomingMeetings(req: Request, res: Response) {
    try {
      const useCase = new GetUpcomingMeetingsUseCase(calendlyRepo);
      const events = await useCase.execute((req as any).user.id);
      res.status(200).json({ events });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async pastMeetings(req: Request, res: Response) {
    try {
      const useCase = new GetPastMeetingsUseCase(calendlyRepo);
      const events = await useCase.execute((req as any).user.id);
      res.status(200).json({ events });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async clientList(req: Request, res: Response) {
    try {
      const useCase = new GetClientListUseCase(calendlyRepo);
      const clients = await useCase.execute((req as any).user.id);
      res.status(200).json({ clients });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
}
