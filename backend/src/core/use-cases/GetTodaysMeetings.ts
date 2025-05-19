import { IMeetingRepository } from '../repositories/MeetingRepository';

export class GetTodaysMeetingsUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}

  async execute(expertId: number) {
    return this.meetingRepo.findTodaysMeetings(expertId);
  }
}
