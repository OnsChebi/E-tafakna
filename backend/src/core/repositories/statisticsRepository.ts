


export interface IStatRepository {
  
  countTotalClients(expertId: number): Promise<number>;
  countTodaysMeetings(expertId: number): Promise<number>;
  countUpcomingMeetings(expertId: number): Promise<number>;
  countMeetingsPerDayThisWeek(expertId: number): Promise<{ day: string, count: number }[]>;
  countMeetingsPerMonthThisyear(expertId: number): Promise<{ month: string, count: number }[]>;
  countMeetingTypes(expertId: number): Promise<{ type: 'online' | 'in-person', count: number }[]>;
  countActiveFoldersByUser(expertId: number):Promise<number>;


}
