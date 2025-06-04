import { IMeetingRepository } from "../../repositories/MeetingRepository";

export class GetUpcomingMeetingsUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}

  async execute(expertId: number) {
    return this.meetingRepo.findUpcomingMeetings(expertId);
  }
}
