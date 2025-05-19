// core/use-cases/GetBusyDays.ts
import { IMeetingRepository } from "../repositories/MeetingRepository";

export class GetBusyDaysUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}

  async execute(expertId: number) {
    return this.meetingRepo.findBusyDays(expertId); 
  }
}
