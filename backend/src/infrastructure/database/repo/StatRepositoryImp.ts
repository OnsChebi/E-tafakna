import { Repository, LessThan, MoreThan, Between } from "typeorm";
import { Meeting } from "../../../core/entities/Meeting.entity";
import { AppDataSource } from "../db";
import { Folder } from "../../../core/entities/Folder.entity";
import { IStatRepository } from "../../../core/repositories/statisticsRepository";

export class StatRepositoryImpl implements IStatRepository {

  private repo: Repository<Meeting>;

  constructor() {
    this.repo = AppDataSource.getRepository(Meeting);
  }
 



async countTotalClients(expertId: number): Promise<number> {
  const meetings = await this.repo.find({
    where: { expert: { id: expertId }, status: "active" },
    select: ["inviteeEmail"],
  });

  const uniqueEmails = new Set(meetings.map(m => m.inviteeEmail));
  return uniqueEmails.size;
}

async countTodaysMeetings(expertId: number): Promise<number> {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));

  return this.repo.count({
    where: {
      expert: { id: expertId },
      startTime: Between(start, end),
      status: "active",
    },
  });
}

async countUpcomingMeetings(expertId: number): Promise<number> {
  const now = new Date();
  return this.repo.count({
    where: {
      expert: { id: expertId },
      startTime: MoreThan(now),
      status: "active",
    },
  });
}

async countMeetingsPerDayThisWeek(expertId: number): Promise<{ day: string, count: number }[]> {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const result = await AppDataSource.getRepository(Meeting)
    .createQueryBuilder("meeting")
    .select("DAYNAME(meeting.startTime)", "day")
    .addSelect("COUNT(*)", "count")
    .where("meeting.expertId = :expertId", { expertId })
    .andWhere("meeting.startTime BETWEEN :startOfWeek AND :endOfWeek", {
      startOfWeek,
      endOfWeek,
    })
    .groupBy("day")
    .orderBy("FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')")
    .getRawMany();

  return result.map((row: any) => ({
    day: row.day,
    count: parseInt(row.count),
  }));
}

async countActiveFoldersByUser(expertId: number): Promise<number> {
  const count = await AppDataSource.getRepository(Folder)
    .createQueryBuilder("folder")
    .where("folder.expertId = :expertId", { expertId })
    .getCount();

  return count;
}




async countMeetingTypes(expertId: number): Promise<{ type: 'online' | 'in-person', count: number }[]> {
  const result = await AppDataSource.getRepository(Meeting)
    .createQueryBuilder("meeting")
    .select("meeting.type", "type")
    .addSelect("COUNT(*)", "count")
    .where("meeting.expertId = :expertId", { expertId })
    .groupBy("meeting.type")
    .getRawMany();

  return result.map((row: any) => ({
    type: row.type,
    count: parseInt(row.count),
  }));
}
}