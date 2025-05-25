import { Request, Response } from "express";
import { GetMeetingStatistics } from "../../../core/use-cases/GetMeetingStatistics";
import { StatRepositoryImpl } from "../../database/repo/StatRepositoryImp";


interface AuthenticatedRequest extends Request {
  user?: { id: number };
}


export const getMeetingStats = async (req: Request, res: Response) => {
  const expertId = (req as AuthenticatedRequest).user?.id;
  if (!expertId) {res.status(401).json({ message: "Unauthorized" });
  return;
  }
  const useCase = new GetMeetingStatistics(new StatRepositoryImpl());

  try {
    const result = await useCase.execute(expertId);
    res.status(200).json(result);
  } catch (e) {
    console.error("Error getting stats:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

