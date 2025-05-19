// core/use-cases/CancelMeetings.ts
import { IMeetingRepository } from "../repositories/MeetingRepository";

export class CancelMeetingsUseCase {
  constructor(private meetingRepo: IMeetingRepository) {}

  async execute(meetingId: number) {
    return this.meetingRepo.cancelMeeting(meetingId); 
  }
}
