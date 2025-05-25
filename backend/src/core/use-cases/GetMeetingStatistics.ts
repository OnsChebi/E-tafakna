// core/use-cases/GetMeetingStatistics.ts
import { IStatRepository } from "../repositories/statisticsRepository";

export class GetMeetingStatistics {
  constructor(private readonly statRepo: IStatRepository) {}

  async execute(expertId: number ) {
    const [
      totalClients,
      todaysMeetings,
      upcomingMeetings,
      weeklyMeetings,
      meetingTypes,
      activeFolder
    ] = await Promise.all([
      this.statRepo.countTotalClients(expertId),
      this.statRepo.countTodaysMeetings(expertId),
      this.statRepo.countUpcomingMeetings(expertId),
      this.statRepo.countMeetingsPerDayThisWeek(expertId),
      this.statRepo.countMeetingTypes(expertId),
      this.statRepo.countActiveFoldersByUser(expertId)
    ]);

    return {
      totalClients,
      todaysMeetings,
      upcomingMeetings,
      weeklyMeetings,
      meetingTypes,
      activeFolder
    };
  }
}
