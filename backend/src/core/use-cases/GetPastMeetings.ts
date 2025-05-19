import { IMeetingRepository } from '../repositories/MeetingRepository';

export class GetPastMeetingsUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}

  async execute(expertId: number) {
    return this.meetingRepo.findPastMeetings(expertId);
  }
}
